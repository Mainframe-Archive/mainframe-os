// @flow

// eslint-disable-next-line import/named
import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'
import { uniqueID } from '@mainframe/utils-id'

import OwnIdentity, {
  parseKeyPair,
  serializeKeyPair,
  type KeyPairSerialized,
} from './OwnIdentity'

type OwnUserProfile = {
  name: string,
  avatar?: ?string,
}

export type OwnUserIdentitySerialized = {
  localID: string,
  keyPair: KeyPairSerialized,
  profile?: OwnUserProfile,
}

export default class OwnUserIdentity extends OwnIdentity {
  static create = (
    profile: OwnUserProfile,
    keyPair?: KeyPair,
    localID?: string,
  ): OwnUserIdentity => {
    return new OwnUserIdentity(
      localID || uniqueID(),
      keyPair || createSignKeyPair(),
      profile,
    )
  }

  static fromJSON = (
    serialized: OwnUserIdentitySerialized,
  ): OwnUserIdentity => {
    return new OwnUserIdentity(
      serialized.localID,
      parseKeyPair(serialized.keyPair),
      serialized.profile,
    )
  }

  static toJSON = (identity: OwnUserIdentity): OwnUserIdentitySerialized => {
    return {
      localID: identity.localID,
      keyPair: serializeKeyPair(identity.keyPair),
      profile: identity.profile,
    }
  }

  _profile: Object

  constructor(localID: string, keyPair: KeyPair, profile: Object = {}) {
    super(localID, 'user', keyPair)
    this._profile = profile
  }

  get profile(): OwnUserProfile {
    return this._profile
  }
}
