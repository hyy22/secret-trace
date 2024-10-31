import { PrismaClient } from "@prisma/client";
import base62 from 'base62';

const prisma = new PrismaClient();
export async function getHashString() {
  let result: string;
  const hash = await prisma.hash.findFirst({
    where: {
      used: false,
    }
  })
  if (hash) {
    result = hash.hash;
  } else {
    result = await createHash();
  }
  // 标记为已使用
  await prisma.hash.update({
    where: {
      hash: result,
    },
    data: {
      used: true,
    }
  })
  return result;
}
/**
 * 创建hash
 * TODO: 添加定时任务，批量预生成
 */
export async function createHash() {
  const hash = createBase62Hash();
  const exist = await prisma.hash.findFirst({
    where: {
      hash,
    }
  })
  if (exist) {
    return createHash();
  } else {
    await prisma.hash.create({
      data: {
        hash,
        used: false,
      }
    })
    return hash
  };
}
// 创建base62的hash
function createBase62Hash(length = 6): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const num = Math.floor(Math.random() * 62);
    result += base62.encode(num);
  }
  return result;
}