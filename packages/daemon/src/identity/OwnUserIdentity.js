// @flow

// eslint-disable-next-line import/named
import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'

import OwnIdentity, {
  parseKeyPair,
  serializeKeyPair,
  type KeyPairSerialized,
} from './OwnIdentity'

export type OwnUserIdentitySerialized = {
  keyPair: KeyPairSerialized,
  data: Object,
}

export default class OwnUserIdentity extends OwnIdentity {
  static create = (keyPair?: KeyPair, data?: Object = {}): OwnUserIdentity => {
    return new OwnUserIdentity(keyPair || createSignKeyPair(), data)
  }

  static fromJSON = (
    serialized: OwnUserIdentitySerialized,
  ): OwnUserIdentity => {
    return new OwnUserIdentity(
      parseKeyPair(serialized.keyPair),
      serialized.data,
    )
  }

  static toJSON = (identity: OwnUserIdentity): OwnUserIdentitySerialized => {
    return {
      keyPair: serializeKeyPair(identity.keyPair),
      data: identity.data,
    }
  }

  data: Object

  constructor(keyPair: KeyPair, data: Object = {}) {
    super(keyPair)
    this.data = data
  }
}
