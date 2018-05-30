// @flow

import {
  hashStream,
  openSigned,
  sign,
  type KeyPair, // eslint-disable-line import/named
} from '@mainframe/utils-crypto'
import asar from 'asar'
import stringify from 'fast-json-stable-stringify'
import fs from 'fs'

export const createPackage = (src: string, dest: string): Promise<void> => {
  return new Promise(resolve => asar.createPackage(src, dest, resolve))
}

export const createChecksum = (
  filePath: string,
  size: number = 32,
): Promise<Buffer> => {
  return hashStream(fs.createReadStream(filePath), size)
}

const SIGN_KEY_RADIX = 16
const SIGN_KEY_SIZE = 4

const bufferSize = (buffer: Buffer): Buffer => {
  return Buffer.from(
    buffer.length.toString(SIGN_KEY_RADIX).padStart(SIGN_KEY_SIZE, '0'),
  )
}

export const encodeManifest = (
  manifest: Object,
  appKeyPair: KeyPair,
  authorKeyPair: KeyPair,
): Buffer => {
  const manifestData = Buffer.from(stringify(manifest))
  const appSigned = sign(manifestData, appKeyPair.secretKey)
  const authorSigned = sign(appSigned, authorKeyPair.secretKey)

  return Buffer.concat([
    bufferSize(authorKeyPair.publicKey),
    authorKeyPair.publicKey,
    bufferSize(appKeyPair.publicKey),
    appKeyPair.publicKey,
    authorSigned,
  ])
}

const createSliceReader = (buffer: Buffer) => {
  let offset = 0
  return (size: ?number): Buffer => {
    if (size == null) {
      return buffer.slice(offset)
    }
    const end = offset + size
    const slice = buffer.slice(offset, end)
    offset = end
    return slice
  }
}

const readNextKey = (readNext: (size: number) => Buffer): Buffer => {
  const slice = readNext(SIGN_KEY_SIZE)
  const keySize = parseInt(slice.toString(), SIGN_KEY_RADIX)
  return readNext(keySize)
}

export const decodeManifest = (encoded: Buffer): Object => {
  const readNext = createSliceReader(encoded)

  const authorPubKey = readNextKey(readNext)
  const appPubKey = readNextKey(readNext)

  const manifest = readNext()
  const authorChecked = openSigned(manifest, authorPubKey)
  if (authorChecked == null) {
    throw new Error('Failed to verify author signature')
  }

  const appChecked = openSigned(authorChecked, appPubKey)
  if (appChecked == null) {
    throw new Error('Failed to verify app signature')
  }

  return JSON.parse(appChecked.toString())
}
