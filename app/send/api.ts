import { type SendMessageDto, type SendMessageVo } from '@/app/api/model/msg.dto';

export function fetchSendMessage(params: SendMessageDto): Promise<ApiResponse<SendMessageVo>> {
  return fetch('/api/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(res => res.json() as Promise<ApiResponse<SendMessageVo>>)
}