import { validate } from "class-validator"
import { SendMessageDto, SendMessageVo } from '@/app/api/model/msg.dto';
import { plainToInstance } from "class-transformer";
import { buildErrorMsg, buildResponse } from "../lib/utils";
import { sendMsg } from "../model/msg";
import logger from "../lib/logger";

export const POST = async (req: Request) => {
  const body = await req.json();
  const sendMessageDto = plainToInstance(SendMessageDto, body, { enableImplicitConversion: true });
  const errors = await validate(sendMessageDto, { whitelist: true });
  if (errors.length > 0) {
    return buildResponse(false, undefined, buildErrorMsg(errors));
  }
  // 发送消息
  logger.info(`send msg: ${JSON.stringify(sendMessageDto)}`, 'sendMsg')
  const hash = await sendMsg(sendMessageDto);
  return buildResponse<SendMessageVo>(true, { hash });
}