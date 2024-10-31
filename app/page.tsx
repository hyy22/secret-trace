import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'

export default function Home() {
  return <>
    <p className='mb-3'>
      {/* 写一篇关于项目的介绍，主要功能有收信和发信，通过自动销毁来保护隐私，目前有两种模式，阅后即焚和特定时长后销毁，主要技术栈是nextjs和redixUI。其中orm使用prisma，消息队列使用bullmq，参数验证使用class-validator */}
      本项目是一个基于Next.js、TailwindCss和Redix UI的隐私保护消息传递系统。其主要功能包括收信和发信，通过自动销毁来保护隐私。目前，该项目有两种模式：阅后即焚和特定时长后销毁。主要技术栈包括Next.js、Redix UI、Prisma、BullMQ和Class-validator。
      在收信方面，用户可以通过输入一个唯一的链接来接收消息。该链接将自动销毁，确保消息的安全性。在发信方面，用户可以创建一个消息，并选择销毁时间。消息将在指定时间后自动销毁，确保隐私保护。
      在技术实现方面，该项目使用了Next.js和Redix UI来构建用户界面。ORM使用Prisma，消息队列使用BullMQ，参数验证使用Class-validator。通过这些技术栈，我们能够构建一个高效、安全且易于维护的消息传递系统。
      本项目旨在为用户提供一个安全、便捷的隐私保护消息传递平台。无论您是个人用户还是企业用户，都可以放心使用本项目来发送和接收消息。
    </p>
    <Button asChild>
      <Link href={'/send'}>
        <PaperPlaneIcon />
        <span>开始使用</span>
      </Link>
    </Button>
  </>
}
