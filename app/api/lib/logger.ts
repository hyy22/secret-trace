import winston from "winston";
import "winston-daily-rotate-file";

// 日志格式化
function formatLogger(color = false) {
  const { format } = winston;
  const combined = [
    ...(color ? [format.colorize()] : []),
    format.timestamp({
      format: 'YYYY/MM/DD HH:mm:ss',
    }),
    format.splat(),
    format.printf((info) => {
      return `${info.timestamp} ${info.context ? `[${info.context}] ` : ''}${
        info.level
      }: ${info.message}${info.stack ? `\n${info.stack}` : ''}`;
    }),
  ];
  return format.combine(...combined);
}
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: formatLogger(true),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: formatLogger(),
    }),
  ],
});
export default logger;