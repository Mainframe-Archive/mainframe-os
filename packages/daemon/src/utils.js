// @flow

import { readFile, writeFile } from 'fs-extra'
import nanoid from 'nanoid'
import sodium from 'sodium-native'

import {
  encryptSym,
  decryptSym,
  type EncryptedMessage,
  type KeyPair,
} from './crypto'

export opaque type base64: string = string

export const fromBase64 = (input: string): Buffer =>
  Buffer.from(input, 'base64')

export const toBase64 = (input: Buffer) => (input.toString('base64'): base64)

export opaque type ID: string = string

export const typeID = (value: any) => (value: ID)

export const uniqueID = () => typeID(nanoid())

export const keyPairToBuffer = (pair: KeyPair): Buffer =>
  Buffer.concat([pair.publicKey, pair.secretKey])

export const keyPairFromBuffer = (buffer: Buffer, pkSize: number): KeyPair => ({
  publicKey: buffer.slice(0, pkSize),
  secretKey: buffer.slice(pkSize),
})

export const encryptedMessageToBuffer = (msg: EncryptedMessage): Buffer =>
  Buffer.concat([msg.nonce, msg.cipher])

export const encryptedMessageFromBuffer = (
  msg: Buffer,
  nonceSize: number,
): EncryptedMessage => ({
  nonce: msg.slice(0, nonceSize),
  cipher: msg.slice(nonceSize),
})

export const writeSecureFile = (
  path: string,
  contents: Buffer,
  key: Buffer,
) => {
  const data = encryptedMessageToBuffer(encryptSym(contents, key))
  return writeFile(path, data)
}

export const readSecureFile = async (path: string, key: Buffer) => {
  const contents = await readFile(path)
  const encryptedData = encryptedMessageFromBuffer(
    contents,
    sodium.crypto_secretbox_NONCEBYTES,
  )
  return decryptSym(encryptedData, key)
}

// Use instead of Object.values() so Flow properly types the values
// https://github.com/facebook/flow/issues/2221
export const objectValues = (obj: Object) => Object.keys(obj).map(k => obj[k])
