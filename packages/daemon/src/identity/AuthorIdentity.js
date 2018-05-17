// @flow

import { type KeyPair } from '@mainframe/utils-crypto'

import Identity from './Identity'
import Keychain, { type KeychainSerialized } from './Keychain'

export type AuthorIdentitySerialized = {
  keychain: KeychainSerialized,
}

export default class AuthorIdentity extends Identity {
  static create = (key?: KeyPair): AuthorIdentity => {
    const keychain = new Keychain()
    if (key == null) {
      keychain.createPairSign()
    } else {
      keychain.addPairSign(key)
    }
    return new AuthorIdentity(keychain)
  }

  static fromJSON = (serialized: AuthorIdentitySerialized): AuthorIdentity => {
    return new AuthorIdentity(Keychain.fromJSON(serialized.keychain))
  }

  static toJSON = (identity: AuthorIdentity): AuthorIdentitySerialized => ({
    keychain: Keychain.toJSON(identity.keychain),
  })
}
