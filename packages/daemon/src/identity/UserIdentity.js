// @flow

import Identity from './Identity'
import Keychain, { type KeychainSerialized } from './Keychain'

export type UserIdentitySerialized = {
  keychain: KeychainSerialized,
}

export default class UserIdentity extends Identity {
  static create = (keychain?: Keychain): UserIdentity => {
    return new UserIdentity(keychain || new Keychain())
  }

  static fromJSON = (serialized: UserIdentitySerialized): UserIdentity => {
    return new UserIdentity(Keychain.fromJSON(serialized.keychain))
  }

  static toJSON = (identity: UserIdentity): UserIdentitySerialized => ({
    keychain: Keychain.toJSON(identity.keychain),
  })
}
