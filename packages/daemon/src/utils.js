// @flow

import {
  encryptSecretBox,
  decryptSecretBox,
  type EncryptedBox,
  type KeyPair,
} from '@mainframe/utils-crypto'
import { readFile, writeFile } from 'fs-extra'
import nanoid from 'nanoid'
// TODO: sodium is only needed to access the crypto_secretbox_NONCEBYTES
// could be a re-export from @mainframe/utils-crypto or have the lib provide these helpers
import sodium from 'sodium-native'

export opaque type base64: string = string

export const fromBase64 = (input: string): Buffer => {
  return Buffer.from(input, 'base64')
}

export const toBase64 = (input: Buffer) => (input.toString('base64'): base64)

export opaque type ID: string = string

export const typeID = (value: any) => (value: ID)

export const uniqueID = () => typeID(nanoid())

export const keyPairToBuffer = (pair: KeyPair): Buffer => {
  return Buffer.concat([pair.publicKey, pair.secretKey])
}

export const keyPairFromBuffer = (buffer: Buffer, pkSize: number): KeyPair => ({
  publicKey: buffer.slice(0, pkSize),
  secretKey: buffer.slice(pkSize),
})

export const encryptedBoxToBuffer = (encrypted: EncryptedBox): Buffer => {
  return Buffer.concat([encrypted.nonce, encrypted.cipher])
}

export const encryptedBoxFromBuffer = (
  msg: Buffer,
  nonceSize: number,
): EncryptedBox => ({
  nonce: msg.slice(0, nonceSize),
  cipher: msg.slice(nonceSize),
})

export const writeSecureFile = (
  path: string,
  contents: Buffer,
  key: Buffer,
) => {
  const data = encryptedBoxToBuffer(encryptSecretBox(contents, key))
  return writeFile(path, data)
}

export const readSecureFile = async (path: string, key: Buffer) => {
  const contents = await readFile(path)
  const encryptedData = encryptedBoxFromBuffer(
    contents,
    sodium.crypto_secretbox_NONCEBYTES,
  )
  return decryptSecretBox(encryptedData, key)
}

export const mapObject = <T, U>(mapper: (input: T) => U) => (
  obj: ?{ [string]: T },
): { [string]: U } => {
  return obj == null
    ? {}
    : Object.keys(obj).reduce((acc, key) => {
        // $FlowFixMe: obj[key] shouldn't be possibly null
        acc[key] = mapper(obj[key])
        return acc
      }, {})
}
