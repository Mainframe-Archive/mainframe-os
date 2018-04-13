// @flow

import { unlink } from 'fs'
import { createServer, type Server, type Socket } from 'net'

import ClientHandler from './ClientHandler'
import handlers from './handlers'

export default (path: string): Promise<Server> => {
  return new Promise((resolve, reject) => {
    const server = createServer((socket: Socket) => {
      new ClientHandler(socket, handlers)
    })

    unlink(path, () => {
      server.listen(path, err => {
        if (err) reject(err)
        else resolve(server)
      })
    })
  })
}
