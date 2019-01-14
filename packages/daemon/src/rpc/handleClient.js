// @flow

import type { Socket } from 'net'
import { inspect } from 'util'
import { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'
import type { Environment } from '@mainframe/config'
import createHandler, {
  parseJSON,
  type IncomingMessage, // eslint-disable-line import/named
} from '@mainframe/rpc-handler'
import { uniqueID } from '@mainframe/utils-id'
import debug from 'debug'

import ClientContext from '../context/ClientContext'
import type { VaultRegistry } from '../vault'

import methods from './methods'

export type NotifyFunc = (method: string, params: Object) => void

const handleMessage = createHandler({
  methods,
  onHandlerError: (ctx: ClientContext, msg: IncomingMessage, err: Error) => {
    ctx.log('handler error', msg, err.stack)
  },
  onInvalidMessage: (ctx: ClientContext, msg: IncomingMessage) => {
    ctx.log('invalid message', msg)
  },
  onNotification: (ctx: ClientContext, msg: IncomingMessage) => {
    ctx.log('notification received', msg)
  },
  validatorOptions: {
    messages: MANIFEST_SCHEMA_MESSAGES,
  },
})

export default (socket: Socket, env: Environment, vaults: VaultRegistry) => {
  const ns = `mainframe:daemon:rpc:client:${uniqueID()}`
  const log = debug(ns)
  const logIO = debug(`${ns}:io`)

  const logJSON = (msg: string, data: Object) => {
    logIO(msg, inspect(data, { colors: true, depth: 5 }))
  }

  const sendJSON = (payload: Object) => {
    logJSON('<==', payload)
    socket.write(JSON.stringify(payload))
  }

  const sendNotification = (method: string, params: Object) => {
    sendJSON({ jsonrpc: '2.0', method, params })
  }

  const context = new ClientContext({
    log,
    env,
    notify: sendNotification,
    socket,
    vaults,
  })

  socket.on('data', async (chunk: Buffer) => {
    let msg
    try {
      msg = parseJSON(chunk.toString())
    } catch (err) {
      return sendJSON({ jsonrpc: '2.0', error: err.toObject() })
    }

    logJSON('==>', msg)

    const reply = await handleMessage(context, msg)
    if (reply != null) {
      sendJSON(reply)
    }
  })

  socket.on('end', async () => {
    log('disconnected')
    await context.clear()
    log('context cleared')
  })

  log('connected')
}
