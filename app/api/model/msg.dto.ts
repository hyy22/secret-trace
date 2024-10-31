import { Type } from 'class-transformer';
import { ValidateNested, IsString, IsEnum, IsNotEmpty, IsOptional, IsNumber, ValidateIf, Max, Min } from 'class-validator';
import 'reflect-metadata';

// 消息类型
export enum MessageType {
  TEXT,
  FILE
}
// 消息销毁方式
export enum DestroyType {
  // 阅后即焚
  AFTER_READ,
  // 发送后即焚
  AFTER_SEND_MINUTES,
}
/**
 * 发送消息dto
 */
export class Message {
  // 消息类型
  @IsEnum(MessageType, { message: '消息类型不合法'})
  type!: MessageType;
  // 消息内容
  @IsNotEmpty({ message: '消息内容不能为空' })
  @IsString({ message: '消息内容不合法' })
  content!: string;
}
export class SendMessageDto {
  // 消息内容
  @ValidateNested()
  @Type(() => Message)
  message!: Message;
  // 销毁方式
  @IsEnum(DestroyType, { message: '销毁方式不合法' })
  destroyType!: DestroyType;
  // 发送后多久销毁(单位: 秒)
  @ValidateIf((o: SendMessageDto) => o.destroyType === DestroyType.AFTER_SEND_MINUTES)
  @IsNumber({}, { message: '分钟必须为数字' })
  @Min(1, { message: '分钟不能小于1' })
  @Max(7 * 24 * 60, { message: '最大不能超过7天' })
  destroyMinutes?: number | null;
  // 口令
  @IsOptional()
  @IsString({ message: '口令不合法' })
  secret?: string | null;
}
/**
 * 发送消息vo
 */
export class SendMessageVo {
  // hash
  hash!: string;
}
/**
 * 检查消息状态
 */
export class CheckMessageVo extends SendMessageDto {}