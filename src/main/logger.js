// @flow

import winston from 'winston'

import type { Environment } from './environment'

type LogLevel = $Keys<$winstonNpmLogLevels>

export type Logger = {
  child: (meta: Object) => Logger,
  log: (info: { level: LogLevel, message: string, [string]: any }) => void,
  [level: LogLevel]: (message: string) => void,
}

export const createLogger = (env: Environment): Logger => {
  // $FlowFixMe: winston type def
  const logger = winston.createLogger({
    level: env.isDev ? 'silly' : 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: env.getLogFilePath('error.log'),
        level: 'error',
      }),
      new winston.transports.File({
        filename: env.getLogFilePath('combined.log'),
      }),
    ],
  })

  if (env.isDev || process.env.MAINFRAME_LOG) {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
        level: process.env.MAINFRAME_LOG || 'debug',
      }),
    )
  }

  logger.exceptions.handle(
    new winston.transports.File({
      filename: env.getLogFilePath('exceptions.log'),
    }),
  )

  return logger
}
