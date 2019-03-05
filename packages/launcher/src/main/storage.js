// @flow

import crypto from 'crypto'
import { Transform } from 'stream'
import * as mime from 'mime'
import type { AppContext } from './contexts'

const INITIALIZATION_VECTOR_SIZE = 16

export class PrependInitializationVector extends Transform {
  constructor(iv) {
    super()
    this._added = false
    this._iv = iv
  }

  _transform(chunk, encoding, callback) {
    if (!this._added) {
      this._added = true
      this.push(this._iv)
    }
    this.push(chunk)
    callback()
  }
}

export class Decrypt extends Transform {
  constructor(cipherKey) {
    super()
    this.cipherKey = cipherKey
  }

  _transform(chunk, encoding, callback) {
    if (!this._decode) {
      const iv = chunk.slice(0, INITIALIZATION_VECTOR_SIZE)

      this._decode = crypto.createDecipheriv('aes256', this.cipherKey, iv)
      this._decode.on('data', c => {
        this.push(c)
      })
      this._decode.on('end', () => {
        this.emit('end')
      })

      this._decode.write(chunk.slice(INITIALIZATION_VECTOR_SIZE, chunk.length))
    } else {
      this._decode.write(chunk)
    }
    callback()
  }
}

export const registerStreamProtocol = (context: AppContext) => {
  context.sandbox.session.protocol.registerStreamProtocol(
    'app-file',
    async (request, callback) => {
      // URL starts with `app-file://`
      const filePath = request.url.slice(11)
      if (filePath.length === 0) {
        callback({
          mimeType: 'text/html',
          data: Buffer.from('<h5>Not found</h5>'),
        })
      } else {
        const contentType = mime.getType(filePath)
        const res = await context.bzz.download(
          `${context.storage.feedHash}/${filePath}`,
        )
        const data = res.body.pipe(new Decrypt(context.storage.encryptionKey))
        callback({
          headers: {
            'content-type': contentType,
          },
          data: data,
        })
      }
    },
    error => {
      if (error) console.error('Failed to register protocol')
    },
  )
}
