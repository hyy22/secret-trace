import { checkMsg, setMsgAsRead } from '@/app/api/model/msg';
import { CheckMessageVo, DestroyType } from '@/app/api/model/msg.dto';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';
import { Button, Link, Blockquote } from '@radix-ui/themes';

export default async function Receive({ params, searchParams }: { params: Promise<{ slug: string}>, searchParams: Promise<{secret: string}>}) {
  const { slug: hash } = await params;
  const { secret } = await searchParams;
  // 查询消息内容
  let msg: CheckMessageVo;
  try {
    msg = await checkMsg(hash);
    // 上报已读
    await setMsgAsRead(hash);
  } catch (e: any) {
    return <>
      { e.message }
    </>
  }
  if (msg.secret && msg.secret !== secret) {
    return <Callout.Root>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        密码错误，无法查看消息内容
      </Callout.Text>
    </Callout.Root>
  }
  return <>
    <div className='py-3'>
      <Blockquote>
        <div className='whitespace-pre-wrap'>{ msg.message.content }</div>
      </Blockquote>
    </div>
    <Callout.Root>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        { msg.destroyType === DestroyType.AFTER_READ ? '消息将在阅读后自动销毁' : `消息将在${msg.destroyMinutes}分钟后自动销毁`}
      </Callout.Text>
    </Callout.Root>
    <div className="mt-5">
      <Button asChild variant="surface">
        <Link className="" href="/send">我也要发</Link>
      </Button>
    </div>
  </>
}