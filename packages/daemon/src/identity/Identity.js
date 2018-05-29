// @flow

import {
  getSignature,
  openSigned,
  sign,
  verifySignature,
  type KeyPair, // eslint-disable-line import/named
} from '@mainframe/utils-crypto'
import type { ID } from '@mainframe/utils-id'

import Keychain from './Keychain'

export default class Identity {
  _keychain: Keychain

  constructor(keychain: Keychain) {
    this._keychain = keychain
  }

  get keychain(): Keychain {
    return this._keychain
  }

  getPairSign(id?: ID): ?KeyPair {
    return this._keychain.getPairSign(id)
  }

  getSignature(message: Buffer, id?: ID): Buffer {
    const keyPair = this._keychain.getPairSign(id)
    if (keyPair == null) {
      throw new Error('No key pair to sign with')
    }
    return getSignature(message, keyPair.secretKey)
  }

  sign(message: Buffer, id?: ID): Buffer {
    const keyPair = this._keychain.getPairSign(id)
    if (keyPair == null) {
      throw new Error('No key pair to sign with')
    }
    return sign(message, keyPair.secretKey)
  }

  verifySignature(message: Buffer, signature: Buffer, id?: ID): boolean {
    const key = this._keychain.getPublicSign(id)
    return key ? verifySignature(message, signature, key) : false
  }

  openSigned(signed: Buffer, id?: ID): ?Buffer {
    const key = this._keychain.getPublicSign(id)
    if (key != null) {
      return openSigned(signed, key)
    }
  }
}
