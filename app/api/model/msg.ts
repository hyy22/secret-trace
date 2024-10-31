import { PrismaClient } from "@prisma/client";
import { SendMessageDto, DestroyType, CheckMessageVo } from './msg.dto';
import { getHashString } from './hash';
import msgQueue from "./msg.queue";
import { CronJob } from "cron";
import logger from "../lib/logger";

const prisma = new PrismaClient();
/**
 * 发送消息
 */
export async function sendMsg(dto: SendMessageDto): Promise<string> {
  // 1.取hash
  const hash = await getHashString();
  // 2.存消息
  await prisma.msg.create({
    data: {
      hash,
      type: dto.message.type,
      content: dto.message.content,
      destroyType: dto.destroyType,
      destroyMinutes: dto.destroyMinutes ?? 0,
      secret: dto.secret,
    }
  })
  if (dto.destroyType === DestroyType.AFTER_SEND_MINUTES) {
    msgQueue.add('destroy-msg', hash, {
      delay: Number(dto.destroyMinutes) * 60 * 1000,
    })
    logger.info(`消息${hash}已加入销毁队列`);
  }
  // 3.返回hash
  return hash;
}
/**
 * 查看消息
 */
export async function checkMsg(hash: string): Promise<CheckMessageVo> {
  const msg = await prisma.msg.findUnique({
    where: {
      hash,
    }
  })
  if (!msg) {
    throw new Error('消息不存在或已被销毁');
  } else if (msg.destroyedAt) {
    throw new Error('消息已被销毁');
  } else {
    const vo = new CheckMessageVo();
    vo.message = {
      type: msg.type,
      content: msg.content,
    }
    vo.destroyType = msg.destroyType;
    vo.destroyMinutes = msg.destroyMinutes;
    vo.secret = msg.secret;
    return vo;
  }
}
/**
 * 设置消息已读
 */
export async function setMsgAsRead(hash: string) {
  const msg = await prisma.msg.findUnique({
    where: {
      hash,
    }
  })
  if (!msg) {
    throw new Error('消息不存在');
  }
  if (msg.destroyedAt) {
    throw new Error('消息已销毁');
  }
  // 更新查看次数
  await prisma.msg.update({
    where: {
      hash,
    },
    data: {
      // 查看次数+1
      viewCount: {
        increment: 1,
      },
    }
  })
  // 如果是阅后即焚，则删除
  if (msg.destroyType === DestroyType.AFTER_READ) {
    await destroyMsg(hash);
  }
  return true;
}
/**
 * 销毁消息
 */
export async function destroyMsg(hash: string) {
  return prisma.$transaction(async ctx => {
    // 1.更新msg表
    await ctx.msg.update({
      where: {
        hash,
      },
      data: {
        destroyedAt: new Date(),
      }
    });
    // 2.更新hash表
    await ctx.hash.update({
      where: {
        hash,
      },
      data: {
        isDeleted: true,
      }
    })
  });
}
/**
 * 定时任务：销毁已过期的消息
 * 每周一凌晨3点执行 '0 3 * * 1'
 */
new CronJob('0 3 * * 1', async () => {
  prisma.$transaction(async ctx => {
    logger.info('开始执行定时任务：销毁已过期的消息');
    // 1.删除所有已过期的消息
    await ctx.msg.deleteMany({
      where: {
        destroyedAt: {
          not: null,
        }
      }
    })
    // 2.删除所有已过期的hash
    await ctx.hash.deleteMany({
      where: {
        isDeleted: true,
      }
    })
  })
},
null,
true, 'Asia/Shanghai')