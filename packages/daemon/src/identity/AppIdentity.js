// @flow

// eslint-disable-next-line import/named
import { type KeyPair } from '@mainframe/utils-crypto'
// eslint-disable-next-line import/named
import { type ID } from '@mainframe/utils-id'

import { decodeTyped, encodeTyped, fromMFID, toMFID } from '../utils'

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

  static fromMFID = (id: string): AppIdentity => {
    const parts = fromMFID(id)
    if (parts[0] === 'app' && parts[1] === 'sign' && parts.length === 3) {
      const keychain = new Keychain()
      keychain.addPublicSign(decodeTyped(parts[3]))
      return new AppIdentity(keychain)
    } else {
      throw new Error('Invalid app MFID')
    }
  }

  static toMFID = (identity: AppIdentity, signKeyID?: ID): string => {
    const sign = identity.getPairSign(signKeyID)
    if (sign == null) {
      throw new Error('No sign key')
    }
    return toMFID('app', 'sign', encodeTyped('base64', sign.publicKey))
  }
}
