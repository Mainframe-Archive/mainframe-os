// @flow

import { unlink } from 'fs'
import { createServer, type Server, type Socket } from 'net'

import handleClient from './handleClient'

export default class ServerHandler {
  _clients: Set<Socket> = new Set()
  _path: string
  _server: Server

  constructor(path: string) {
    this._path = path
    this._server = createServer((socket: Socket) => {
      this._clients.add(socket)
      socket.on('close', () => {
        this._clients.delete(socket)
      })
      handleClient(socket)
    })

    this._server.on('close', () => {
      this._clients.clear()
    })
  }

  get listening(): boolean {
    // $FlowFixMe: missing property in type definition?
    return this._server.listening
  }

  async start() {
    if (this.listening) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      unlink(this._path, () => {
        this._server.listen(this._path, err => {
          if (err) reject(err)
          else resolve()
        })
      })
    })
  }

  async stop() {
    if (!this.listening) {
      return Promise.resolve()
    }

    return new Promise(resolve => {
      this._server.close(resolve)
      this._clients.forEach(socket => {
        // $FlowFixMe: missing type def for destroyed?
        if (!socket.destroyed) {
          socket.destroy()
        }
      })
    })
  }
}
