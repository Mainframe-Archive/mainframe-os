// @flow

import type { Socket } from 'net'

import {
  parseError,
  methodNotFound,
  invalidRequest,
  type RPCError,
} from './errors'

type ID = number | string

export default class ClientHandler {
  _methods: Object
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

  async handleRequest(method: string, params: any) {
    const handler = this._methods[method]
    if (handler == null) {
      throw methodNotFound()
    }
    return await handler(this._socket, params)
  }

  async handleData(chunk: Buffer) {
    let req
    try {
      req = JSON.parse(chunk.toString())
    } catch (err) {
      return this.sendError(null, parseError())
    }

    if (req.jsonrpc !== '2.0' || req.method == null) {
      return this.sendError(req.id, invalidRequest())
    }

    try {
      const result = await this.handleRequest(req.method, req.params)
      this.sendResult(req.id, result)
    } catch (err) {
      this.sendError(req.id, err)
    }
  }
}
