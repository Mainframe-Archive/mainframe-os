// @flow

// eslint-disable-next-line import/named
import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'

import OwnIdentity, {
  parseKeyPair,
  serializeKeyPair,
  type KeyPairSerialized,
} from './OwnIdentity'

export type OwnDeveloperIdentitySerialized = {
  keyPair: KeyPairSerialized,
  data: Object,
}

export default class OwnDeveloperIdentity extends OwnIdentity {
  static create = (
    keyPair?: KeyPair,
    data?: Object = {},
  ): OwnDeveloperIdentity => {
    return new OwnDeveloperIdentity(keyPair || createSignKeyPair(), data)
  }

  static fromJSON = (
    serialized: OwnDeveloperIdentitySerialized,
  ): OwnDeveloperIdentity => {
    return new OwnDeveloperIdentity(
      parseKeyPair(serialized.keyPair),
      serialized.data,
    )
  }

  static toJSON = (
    identity: OwnDeveloperIdentity,
  ): OwnDeveloperIdentitySerialized => {
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
