// @flow

import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'

export const createKeyPair = createSignKeyPair

export type KeyPairSerialized = {
  publicKey: string,
  secretKey: string,
}

export const parseKeyPair = (serialized: KeyPairSerialized): KeyPair => ({
  publicKey: Buffer.from(serialized.publicKey, 'base64'),
  secretKey: Buffer.from(serialized.secretKey, 'base64'),
})

export const serializeKeyPair = (keyPair: KeyPair): KeyPairSerialized => ({
  publicKey: keyPair.publicKey.toString('base64'),
  secretKey: keyPair.secretKey.toString('base64'),
})
