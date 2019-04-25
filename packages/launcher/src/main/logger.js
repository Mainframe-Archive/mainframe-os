// @flow

import winston from 'winston'

import type { Environment } from './environment'

export type Logger = $winstonLogger<$winstonNpmLogLevels>

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

  if (env.isDev) {
    logger.add(
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.simple(),
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
