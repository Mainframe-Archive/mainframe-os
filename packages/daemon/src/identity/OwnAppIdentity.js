// @flow

import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'
import { uniqueID } from '@mainframe/utils-id'

import OwnIdentity, {
  parseKeyPair,
  serializeKeyPair,
  type KeyPairSerialized,
} from './OwnIdentity'

export type OwnAppIdentitySerialized = {
  keyPair: KeyPairSerialized,
  localID: string,
}

export default class OwnAppIdentity extends OwnIdentity {
  static create = (keyPair?: KeyPair, localID?: string): OwnAppIdentity => {
    return new OwnAppIdentity(
      localID || uniqueID(),
      keyPair || createSignKeyPair(),
    )
  }

  static fromJSON = (serialized: OwnAppIdentitySerialized): OwnAppIdentity => {
    return new OwnAppIdentity(
      serialized.localID,
      parseKeyPair(serialized.keyPair),
    )
  }

  static toJSON = (identity: OwnAppIdentity): OwnAppIdentitySerialized => ({
    keyPair: serializeKeyPair(identity.keyPair),
    localID: identity.localID,
  })

  constructor(localID: string, keyPair: KeyPair) {
    super(localID, 'app', keyPair)
  }
}
