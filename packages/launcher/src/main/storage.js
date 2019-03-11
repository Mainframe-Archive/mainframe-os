// @flow

import * as mime from 'mime'
import { createDecryptStream } from '@mainframe/utils-crypto'
import type { AppContext } from './contexts'

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
        const data = res.body.pipe(
          createDecryptStream(context.storage.encryptionKey),
        )
        callback({
          headers: {
            'content-type': contentType,
          },
          data: data,
        })
      }
    },
    error => {
      // eslint-disable-next-line no-console
      if (error) console.error('Failed to register protocol')
    },
  )
}
