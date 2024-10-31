import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "@/app/config";
import { ConnectionOptions, Queue, Worker } from "bullmq";
import { destroyMsg } from "./msg";
import logger from "../lib/logger";

const connection: ConnectionOptions = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
}
const queue = new Queue('msg-queue', { connection });
// 处理任务
new Worker('msg-queue', async (job) => {
  switch (job.name) {
    case 'destroy-msg':
      logger.info(`trigger-job >> destroy-msg: ${JSON.stringify(job.data)}`);
      await destroyMsg(job.data);
      break;
  }
}, { connection });
export default queue;