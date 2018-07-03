// @flow

import type { Socket } from 'net'
import { inspect } from 'util'
import { uniqueID } from '@mainframe/utils-id'
import RPCError, {
  parseError,
  methodNotFound,
  invalidRequest,
} from '@mainframe/rpc-error'
import debug from 'debug'

import type { VaultRegistry } from '../vault'

import methods from './methods'
import RequestContext from './RequestContext'

type requestID = number | string

export type NotifyFunc = (method: string, params: Object) => void

export default (socket: Socket, vaults: VaultRegistry) => {
  const ns = `mainframe:daemon:rpc:client:${uniqueID()}`
  const log = debug(ns)
  const logIO = debug(`${ns}:io`)

  const logJSON = (msg: string, data: Object) => {
    logIO(msg, inspect(data, { colors: true, depth: 5 }))
  }

  const sendJSON = (data: Object) => {
    const payload = { jsonrpc: '2.0', ...data }
    logJSON('<==', payload)
    socket.write(JSON.stringify(payload))
  }

  const sendError = (id: ?requestID, error: RPCError) => {
    sendJSON({ id, error: { code: error.code, message: error.message } })
  }

  const sendNotification = (method: string, params: Object) => {
    sendJSON({ method, params })
  }

  const sendResult = (id: requestID, result?: any) => {
    sendJSON({ id, result })
  }

  const context = new RequestContext(socket, vaults, sendNotification)

  const handleRequest = async (method: string, params: any) => {
    const handler = methods[method]
    if (handler == null) {
      throw methodNotFound()
    }
    return await handler(context, params)
  }

  socket.on('data', async (chunk: Buffer) => {
    let msg
    try {
      msg = JSON.parse(chunk.toString())
    } catch (err) {
      return sendError(null, parseError())
    }

    logJSON('==>', msg)
    if (msg.jsonrpc !== '2.0') {
      return sendError(msg.id, invalidRequest())
    }

    if (msg.method != null) {
      // Request
      try {
        const result = await handleRequest(msg.method, msg.params)
        sendResult(msg.id, result)
      } catch (err) {
        sendError(msg.id, err)
      }
    } else {
      // TODO?: handle notifications
      // eslint-disable-next-line no-console
      console.log('Unhandled message', msg)
    }
  })

  socket.on('end', () => {
    log('disconnected')
  })

  log('connected')
}
