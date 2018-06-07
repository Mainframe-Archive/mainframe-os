// @flow

import {
  encodeBase64,
  decodeBase64,
  type base64, // eslint-disable-line import/named
} from '@mainframe/utils-base64'
// eslint-disable-next-line import/named
import { type KeyPair } from '@mainframe/utils-crypto'
// eslint-disable-next-line import/named
import { type ID } from '@mainframe/utils-id'

import Identity from './Identity'
import Keychain, { type KeychainSerialized } from './Keychain'

export type AppIdentitySerialized = {
  keychain: KeychainSerialized,
}

export default class AppIdentity extends Identity {
  static create = (key?: KeyPair): AppIdentity => {
    const keychain = new Keychain()
    if (key == null) {
      keychain.createPairSign()
    } else {
      keychain.addPairSign(key)
    }
    return new AppIdentity(keychain)
  }

  static fromJSON = (serialized: AppIdentitySerialized): AppIdentity => {
    return new AppIdentity(Keychain.fromJSON(serialized.keychain))
  }

  static toJSON = (identity: AppIdentity): AppIdentitySerialized => ({
    keychain: Keychain.toJSON(identity.keychain),
  })

  static fromBase64 = (encoded: base64): AppIdentity => {
    const keychain = new Keychain()
    keychain.addPublicSign(decodeBase64(encoded))
    return new AppIdentity(keychain)
  }

  static toBase64 = (identity: AppIdentity, signKeyID?: ID): base64 => {
    const sign = identity.getPairSign(signKeyID)
    if (sign == null) {
      throw new Error('No sign key')
    }
    return encodeBase64(sign.publicKey)
  }
}
