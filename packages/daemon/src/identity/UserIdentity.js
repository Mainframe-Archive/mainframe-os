// @flow

import Identity from './Identity'
import Keychain, { type KeychainSerialized } from './Keychain'

export type UserIdentitySerialized = {
  keychain: KeychainSerialized,
  data: Object,
}

export default class UserIdentity extends Identity {
  static create = (data?: Object = {}, keychain?: Keychain): UserIdentity => {
    return new UserIdentity(data, keychain || new Keychain())
  }

  static fromJSON = (serialized: UserIdentitySerialized): UserIdentity => {
    return new UserIdentity(
      serialized.data,
      Keychain.fromJSON(serialized.keychain),
    )
  }

  static toJSON = (identity: UserIdentity): UserIdentitySerialized => {
    return {
      keychain: Keychain.toJSON(identity.keychain),
      data: identity.data,
    }
  }

  data: Object

  constructor(data: Object = {}, keychain: Keychain) {
    super(keychain)
    this.data = data
  }
}
