import { checkMsg } from "@/app/api/model/msg";
import { CheckMessageVo, DestroyType } from "@/app/api/model/msg.dto";
import CopyText from "@/app/components/CopyText";
import { Callout, Link, Button } from "@radix-ui/themes";
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { NEXT_PUBLIC_HOST } from "@/app/config";

export default async function Feedback({ params, searchParams }: { params: Promise<{ slug: string}>, searchParams: Promise<{ secret?: string}> }) {
  const { slug: hash } = await params;
  const { secret } = await searchParams;
  const shareLink = `${NEXT_PUBLIC_HOST}/receive/${hash}${secret ? `?secret=${secret}` : ''}`;
  // 获取message
  let msg: CheckMessageVo;
  try {
    msg = await checkMsg(hash);
  } catch (e: any) {
    return <>
      {e.message}
    </>
  }
  if (msg.secret && msg.secret !== secret) {
    return <>
      无法查看
    </>
  }
  return <>
    <div className="py-3">
      <p>消息已生成，请复制以下链接发送给需要的人</p>
    </div>
    <CopyText text={shareLink}></CopyText>
    <div className="mt-5">
      <Callout.Root>
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          <DestroyInfo msg={msg} />
        </Callout.Text>
      </Callout.Root>
    </div>
    <div className="mt-5">
      <Button asChild variant="surface">
        <Link className="" href="/send">再发一条</Link>
      </Button>
    </div>
  </>
}

function DestroyInfo({msg}: {msg: CheckMessageVo}) {
  if (msg.destroyType === DestroyType.AFTER_READ) {
    return <>消息将在阅读后自动删除</>
  } else if (msg.destroyType === DestroyType.AFTER_SEND_MINUTES) {
    return <>消息将在{msg.destroyMinutes}分钟后自动删除</>
  }
}