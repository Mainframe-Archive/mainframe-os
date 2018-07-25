// @flow

// eslint-disable-next-line import/named
import { type KeyPair } from '@mainframe/utils-crypto'

import Identity from './Identity'
import Keychain, { type KeychainSerialized } from './Keychain'

export type DeveloperIdentitySerialized = {
  keychain: KeychainSerialized,
  data: Object,
}

export default class DeveloperIdentity extends Identity {
  static create = (data?: Object = {}, key?: KeyPair): DeveloperIdentity => {
    const keychain = new Keychain()
    if (key == null) {
      keychain.createPairSign()
    } else {
      keychain.addPairSign(key)
    }
    return new DeveloperIdentity(data, keychain)
  }

  static fromJSON = (
    serialized: DeveloperIdentitySerialized,
  ): DeveloperIdentity => {
    return new DeveloperIdentity(
      serialized.data,
      Keychain.fromJSON(serialized.keychain),
    )
  }

  static toJSON = (
    identity: DeveloperIdentity,
  ): DeveloperIdentitySerialized => ({
    keychain: Keychain.toJSON(identity.keychain),
    data: identity.data,
  })

  data: Object

  constructor(data: Object = {}, keychain: Keychain) {
    super(keychain)
    this.data = data
  }
}
