// @flow

// eslint-disable-next-line import/named
import { type KeyPair } from '@mainframe/utils-crypto'

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
}
