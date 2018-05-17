// @flow

import debug from 'debug'
import type { Socket } from 'net'
import { inspect } from 'util'

import { uniqueID } from '../utils'

import {
  parseError,
  methodNotFound,
  invalidRequest,
  RPCError,
  type ErrorObject,
} from './errors'
import methods from './methods'

type ID = number | string

type Methods = { [string]: (socket: Socket, params: any) => any | Promise<any> }

type PromiseObject = {
  resolve: (value?: ?any) => void,
  reject: (error: RPCError) => void,
}

export default (socket: Socket) => {
  const ns = `mainframe:daemon:rpc:client:${uniqueID()}`
  const log = debug(ns)
  const logIO = debug(`${ns}:io`)
  const requests: { [id: ID]: PromiseObject } = {}

  const logJSON = (msg: string, data: Object) => {
    logIO(msg, inspect(data, { colors: true, depth: 5 }))
  }

  const sendJSON = (data: Object) => {
    const payload = { jsonrpc: '2.0', ...data }
    logJSON('<==', payload)
    socket.write(JSON.stringify(payload))
  }

  const sendError = (id: ?ID, error: RPCError) => {
    sendJSON({ id, error: { code: error.code, message: error.message } })
  }

  const sendResult = (id: ID, result?: any) => {
    sendJSON({ id, result })
  }

  const sendRequest = (method: string, params?: Array<any>): Promise<?any> => {
    const id = uniqueID()
    return new Promise((resolve, reject) => {
      requests[id] = { resolve, reject }
      sendJSON({ id, method, params })
    })
  }

  const handleRequest = async (method: string, params: any) => {
    const handler = methods[method]
    if (handler == null) {
      throw methodNotFound()
    }
    return await handler(socket, params)
  }

  const handleResponse = async (id: ID, error: ?ErrorObject, result?: any) => {
    const req = requests[id]
    if (req == null) {
      console.warn('Request not found for response', id)
      return
    }

    if (error == null) {
      req.resolve(result)
    } else {
      req.reject(new RPCError(error.code, error.message))
    }
    delete requests[id]
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
    } else if (msg.result != null || msg.error != null) {
      // Response
      handleResponse(msg.id, msg.error, msg.result)
    } else {
      // TODO?: handle notifications
      console.log('Unhandled message', msg)
    }
  })

  socket.on('end', () => {
    log('disconnected')
  })

  log('connected')
}
