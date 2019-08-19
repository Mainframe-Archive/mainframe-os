// @flow

import type { Readable } from 'stream'
import * as mime from 'mime'
import {
  createDecryptStream,
  createEncryptStream,
} from '@mainframe/utils-crypto'

import type { AppContext } from './context/app'

const STORAGE_EMPTY_MANIFEST = JSON.stringify({ entries: [] })

export const getStorageManifestHash = async (
  ctx: AppContext,
): Promise<string> => {
  if (ctx.storage.manifestHash != null) {
    return ctx.storage.manifestHash
  }

  const bzz = ctx.session.user.getBzz()
  let hash = await ctx.storage.feed.getContentHash(bzz)
  if (hash === null) {
    hash = await ctx.storage.feed.publishContent(bzz, STORAGE_EMPTY_MANIFEST)
  }

  ctx.storage.manifestHash = hash
  return hash
}

export const downloadStream = async (
  ctx: AppContext,
  key: string,
): Promise<Readable | null> => {
  const hash = await getStorageManifestHash(ctx)
  const res = await ctx.session.user.getBzz().download(`${hash}/${key}`)
  return res.body.pipe(createDecryptStream(ctx.storage.encryptionKey))
}

export type UploadStreamParams = {
  key: string,
  stream: Readable,
  contentType?: ?string,
}

export const uploadStream = async (
  ctx: AppContext,
  params: UploadStreamParams,
): Promise<void> => {
  const bzz = ctx.session.user.getBzz()
  const stream = params.stream.pipe(
    createEncryptStream(ctx.storage.encryptionKey),
  )
  const manifestHash = await bzz.uploadFileStream(stream, {
    contentType: params.contentType || 'application/octet-stream',
    path: params.key,
    manifestHash: await getStorageManifestHash(ctx),
  })
  await ctx.storage.feed.setContentHash(bzz, manifestHash)
  ctx.storage.manifestHash = manifestHash
}

export const registerStreamProtocol = (context: AppContext) => {
  if (!context.sandbox) {
    throw new Error('context.sandbox does not exist')
  }
  context.sandbox.session.protocol.registerStreamProtocol(
    'app-file',
    async (request, callback) => {
      // URL starts with `app-file://`
      const filePath = request.url.slice(11)
      if (filePath.length === 0) {
        callback({ statusCode: 404 })
      } else {
        try {
          const stream = await downloadStream(context, filePath)
          if (stream === null) {
            callback({ statusCode: 404 })
          } else {
            callback({
              headers: {
                'content-type': mime.getType(filePath),
              },
              data: stream,
            })
          }
        } catch (error) {
          callback({ statusCode: 500 })
        }
      }
    },
    error => {
      // eslint-disable-next-line no-console
      if (error) console.error('Failed to register protocol')
    },
  )
}
