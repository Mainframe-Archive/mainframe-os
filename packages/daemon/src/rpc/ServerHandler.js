// @flow

import { createServer, type Server, type Socket } from 'net'
import { getDaemonSocketPath, type Environment } from '@mainframe/config'
import { remove } from 'fs-extra'

import { VaultRegistry } from '../vault'

import handleClient from './handleClient'

export default class ServerHandler {
  _clients: Set<Socket> = new Set()
  _path: string
  _server: Server
  _vaults: VaultRegistry = new VaultRegistry()

  constructor(env: Environment) {
    this._path = getDaemonSocketPath(env)
    this._server = createServer((socket: Socket) => {
      this._clients.add(socket)
      socket.on('close', async () => {
        await this._vaults.close(socket)
        this._clients.delete(socket)
      })
      handleClient(socket, env, this._vaults)
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

    await remove(this._path)
    return new Promise((resolve, reject) => {
      this._server.listen(this._path, err => {
        if (err) reject(err)
        else resolve()
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
