"use client"
import { TextArea, DataList, RadioGroup, Flex, TextField, Button } from "@radix-ui/themes"
import { RocketIcon } from '@radix-ui/react-icons'
import { useState } from "react"
import { useRouter } from "next/navigation";
import { fetchSendMessage } from './api';
import { DestroyType, MessageType, type SendMessageDto } from '@/app/api/model/msg.dto';
import { showToast } from "@/app/components/Toast";
import { isResponseOk } from "../utils/utils";

export default function Send() {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<DestroyType>(DestroyType.AFTER_READ);
  const [delay, setDelay] = useState('5');
  const [secret, setSecret] = useState('');
  const router = useRouter();
  const submit = async () => {
    if (!message) {
      showToast('请输入消息内容')
      return;
    }
    if (type === DestroyType.AFTER_SEND_MINUTES) {
      const delayNum = Number(delay);
      if (isNaN(delayNum) || delayNum <= 0) {
        showToast('请输入正确的销毁时间');
        return;
      }
    }
    const params: SendMessageDto = {
      message: {
        type: MessageType.TEXT,
        content: message,
      },
      destroyType: type,
      destroyMinutes: type === DestroyType.AFTER_SEND_MINUTES ? Number(delay) : null,
      secret,
    }
    const resp = await fetchSendMessage(params);
    if (!isResponseOk(resp)) {
      showToast(resp.message ?? '');
      return;
    }
    // 跳转到结果页面
    const url = `/feedback/${resp.data?.hash}${secret ? `?secret=${secret}` : ''}`;
    router.push(url);
  }
  return <>
    <TextArea value={message} onChange={e => setMessage(e.target.value)} resize="vertical" radius="large" size="3" placeholder="输入你要发送的消息"></TextArea>
    <DataList.Root className="mt-4">
      <DataList.Item>
        <DataList.Label>销毁时机</DataList.Label>
        <DataList.Value>
          <RadioGroup.Root value={String(type)} onValueChange={e => setType(Number(e))}>
            <RadioGroup.Item value={String(DestroyType.AFTER_READ)}>阅后即焚</RadioGroup.Item>
            <RadioGroup.Item value={String(DestroyType.AFTER_SEND_MINUTES)}>
              <Flex align="center" gap="2">
                <TextField.Root value={delay} onChange={e => setDelay(e.target.value)} className="w-10" type="number" size="1" radius="full" />
                <span>分钟后销毁</span>
              </Flex>
            </RadioGroup.Item>
          </RadioGroup.Root>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>设置口令</DataList.Label>
        <DataList.Value>
          <TextField.Root value={secret} onChange={e => setSecret(e.target.value)} placeholder="如果需要口令，请输入" />
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label></DataList.Label>
        <DataList.Value>
          <Button onClick={submit}><RocketIcon />发送</Button>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  </>
}