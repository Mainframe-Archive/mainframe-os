// @flow

import { unlink } from 'fs'
import { createServer, type Server, type Socket } from 'net'

import ClientHandler from './ClientHandler'
import handlers from './handlers'

const clients: Set<Socket> = new Set()
let server: ?Server
let socketPath: ?string

// TODO: handle running multiple servers, uniquely identified by their socket path

export const start = (path: string): Promise<Server> => {
  return new Promise((resolve, reject) => {
    if (server != null && socketPath != null) {
      if (path === socketPath) {
        resolve(server)
      } else {
        reject(new Error(`Server is already running on ${socketPath}`))
      }
      return
    }

    server = createServer((socket: Socket) => {
      clients.add(socket)
      socket.on('close', () => {
        clients.delete(socket)
      })
      new ClientHandler(socket, handlers)
    })

    server.on('close', () => {
      server = null
      socketPath = null
      clients.clear()
    })

    unlink(path, () => {
      if (server == null) {
        reject(new Error('Server got closed'))
      } else {
        server.listen(path, err => {
          if (err) {
            reject(err)
          } else if (server == null) {
            reject(new Error('Server got closed'))
          } else {
            resolve(server)
          }
        })
      }
    })
  })
}

export const stop = (): Promise<void> => {
  return new Promise(resolve => {
    if (server == null) {
      resolve()
    } else {
      server.close(resolve)
      clients.forEach(socket => {
        // $FlowFixMe: missing type def for destroyed?
        if (!socket.destroyed) {
          socket.destroy()
        }
      })
    }
  })
}
