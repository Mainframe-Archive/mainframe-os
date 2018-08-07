// @flow

// eslint-disable-next-line import/named
import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'

import OwnIdentity, {
  parseKeyPair,
  serializeKeyPair,
  type KeyPairSerialized,
} from './OwnIdentity'

export type OwnAppIdentitySerialized = {
  keyPair: KeyPairSerialized,
}

export default class OwnAppIdentity extends OwnIdentity {
  static create = (keyPair?: KeyPair): OwnAppIdentity => {
    return new OwnAppIdentity(keyPair || createSignKeyPair())
  }

  static fromJSON = (serialized: OwnAppIdentitySerialized): OwnAppIdentity => {
    return new OwnAppIdentity(parseKeyPair(serialized.keyPair))
  }

  static toJSON = (identity: OwnAppIdentity): OwnAppIdentitySerialized => ({
    keyPair: serializeKeyPair(identity.keyPair),
  })
}
