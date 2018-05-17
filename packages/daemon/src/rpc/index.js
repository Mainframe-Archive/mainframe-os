// @flow

import debug from 'debug'
import { type Socket } from 'net'

import ServerHandler from './ServerHandler'

const log = debug('mainframe:daemon:rpc')

const servers: { [socketPath: string]: ServerHandler } = {}

export const start = (path: string): Promise<void> => {
  log('start server using socket path', path)
  let server = servers[path]
  if (server == null) {
    server = new ServerHandler(path)
    servers[path] = server
  }
  return server.start()
}

export const stop = (path: string): Promise<void> => {
  log('stop server using socket path', path)
  const server = servers[path]
  return server == null ? Promise.resolve() : server.stop()
}

export const isListening = (path: string): boolean => {
  const server = servers[path]
  return server == null ? false : server.listening
}
