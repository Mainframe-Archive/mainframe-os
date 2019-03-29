// @flow

import type { Readable } from 'stream'
import * as mime from 'mime'
import {
  createDecryptStream,
  createEncryptStream,
} from '@mainframe/utils-crypto'

import type { AppContext } from './contexts'

const STORAGE_EMPTY_MANIFEST = JSON.stringify({ entries: [] })

export const getStorageManifestHash = async (
  ctx: AppContext,
): Promise<{ feedHash: string, manifestHash: string }> => {
  let feedHash = ctx.storage.feedHash
  let manifestHash

  if (feedHash) {
    manifestHash = await ctx.bzz.getFeedValue(feedHash, {
      mode: 'content-hash',
    })
  } else {
    feedHash = await ctx.bzz.createFeedManifest({ user: ctx.storage.address })
    manifestHash = await ctx.bzz.uploadFeedValue(
      feedHash,
      STORAGE_EMPTY_MANIFEST,
    )
    await ctx.client.app.setFeedHash({
      sessID: ctx.appSession.session.sessID,
      feedHash: feedHash,
    })
    ctx.storage.feedHash = feedHash
  }

  return { feedHash, manifestHash }
}

export const downloadStream = async (
  ctx: AppContext,
  key: string,
): Promise<Readable | null> => {
  const { encryptionKey, feedHash } = ctx.storage
  if (feedHash == null) {
    return null
  }
  const res = await ctx.bzz.download(`${feedHash}/${key}`)
  return res.body.pipe(createDecryptStream(encryptionKey))
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
  const { feedHash, manifestHash } = await getStorageManifestHash(ctx)
  const stream = params.stream.pipe(
    createEncryptStream(ctx.storage.encryptionKey),
  )
  const [dataHash, feedMetadata] = await Promise.all([
    ctx.bzz.uploadFileStream(stream, {
      contentType: params.contentType || 'application/octet-stream',
      path: params.key,
      manifestHash,
    }),
    ctx.bzz.getFeedMetadata(feedHash),
  ])
  await ctx.bzz.postFeedValue(feedMetadata, `0x${dataHash}`)
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
