// @flow

import type { Socket } from 'net'

import { uniqueID } from '../utils'

import {
  parseError,
  methodNotFound,
  invalidRequest,
  RPCError,
  type ErrorObject,
} from './errors'

type ID = number | string

type PromiseObject = {
  resolve: (value?: ?any) => void,
  reject: (error: RPCError) => void,
}

export default class ClientHandler {
  _methods: Object
  _requests: { [id: ID]: PromiseObject } = {}
  _socket: Socket

  constructor(socket: Socket, methods: Object) {
    this._methods = methods
    this._socket = socket

    socket.on('data', this.handleData.bind(this))
    socket.on('end', () => {
      console.log('client disconnected')
    })
    console.log('client connected')
  }

  writeJSON(data: Object) {
    this._socket.write(JSON.stringify({ jsonrpc: '2.0', ...data }))
  }

  sendError(id: ?ID, error: RPCError) {
    this.writeJSON({ id, error: { code: error.code, message: error.message } })
  }

  sendResult(id: ID, result?: any) {
    this.writeJSON({ id, result })
  }

  sendRequest(method: string, params?: Array<any>): Promise<?any> {
    const id = uniqueID()
    return new Promise((resolve, reject) => {
      this._requests[id] = { resolve, reject }
      this.writeJSON({ id, method, params })
    })
  }

  async handleRequest(method: string, params: any) {
    const handler = this._methods[method]
    if (handler == null) {
      throw methodNotFound()
    }
    return await handler(this._socket, params)
  }

  async handleResponse(id: ID, error: ?ErrorObject, result?: any) {
    const req = this._requests[id]
    if (req == null) {
      console.warn('Request not found for response', id)
      return
    }

    if (error == null) {
      req.resolve(result)
    } else {
      req.reject(new RPCError(error.code, error.message))
    }
    delete this._requests[id]
  }

  async handleData(chunk: Buffer) {
    let msg
    try {
      msg = JSON.parse(chunk.toString())
    } catch (err) {
      return this.sendError(null, parseError())
    }
    if (msg.jsonrpc !== '2.0') {
      return this.sendError(msg.id, invalidRequest())
    }

    if (msg.method != null) {
      // Request
      try {
        const result = await this.handleRequest(msg.method, msg.params)
        this.sendResult(msg.id, result)
      } catch (err) {
        this.sendError(msg.id, err)
      }
    } else if (msg.result != null || msg.error != null) {
      // Response
      this.handleResponse(msg.id, msg.error, msg.result)
    } else {
      // TODO?: handle notifications
      console.log('Unhandled message', msg)
    }
  }
}
