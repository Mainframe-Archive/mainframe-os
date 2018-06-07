// @flow

import { decodeBase64, encodeBase64, base64Type } from '@mainframe/utils-base64'
import {
  SECRETBOX_NONCEBYTES,
  encryptSecretBox,
  decryptSecretBox,
  type EncryptedBox, // eslint-disable-line import/named
  type KeyPair, // eslint-disable-line import/named
} from '@mainframe/utils-crypto'
import { outputFile, readFile } from 'fs-extra'

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
  return outputFile(path, data)
}

export const readSecureFile = async (path: string, key: Buffer) => {
  const contents = await readFile(path)
  const encryptedData = encryptedBoxFromBuffer(contents, SECRETBOX_NONCEBYTES)
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
