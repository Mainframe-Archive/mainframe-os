// @flow

import {
  getSignature,
  sign,
  type KeyPair, // eslint-disable-line import/named
} from '@mainframe/utils-crypto'
import multibase from 'multibase'

import Identity from './Identity'

export type KeyPairSerialized = {
  publicKey: string,
  secretKey: string,
}

export const parseKeyPair = (serialized: KeyPairSerialized): KeyPair => ({
  publicKey: multibase.decode(serialized.publicKey),
  secretKey: multibase.decode(serialized.secretKey),
})

export const serializeKeyPair = (keyPair: KeyPair): KeyPairSerialized => ({
  publicKey: multibase.encode('base64', keyPair.publicKey).toString(),
  secretKey: multibase.encode('base64', keyPair.secretKey).toString(),
})

export default class OwnIdentity extends Identity {
  _keyPair: KeyPair

  constructor(localID: string, type: string, keyPair: KeyPair) {
    super(localID, type, keyPair.publicKey)
    this._keyPair = keyPair
  }

  get keyPair(): KeyPair {
    return this._keyPair
  }

  getSignature(message: Buffer): Buffer {
    return getSignature(message, this._keyPair.secretKey)
  }

  sign(message: Buffer): Buffer {
    return sign(message, this._keyPair.secretKey)
  }
}
