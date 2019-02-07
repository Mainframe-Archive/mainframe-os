// @flow

import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'
import { uniqueID } from '@mainframe/utils-id'

import OwnIdentity, {
  parseKeyPair,
  serializeKeyPair,
  type KeyPairSerialized,
} from './OwnIdentity'

export type OwnDeveloperProfile = {
  name: string,
  avatar?: ?string,
}

export type OwnDeveloperIdentitySerialized = {
  localID: string,
  keyPair: KeyPairSerialized,
  profile: OwnDeveloperProfile,
}

export default class OwnDeveloperIdentity extends OwnIdentity {
  static create = (
    profile: OwnDeveloperProfile,
    keyPair?: KeyPair,
    localID?: string,
  ): OwnDeveloperIdentity => {
    return new OwnDeveloperIdentity(
      localID || uniqueID(),
      keyPair || createSignKeyPair(),
      profile,
    )
  }

  static fromJSON = (
    serialized: OwnDeveloperIdentitySerialized,
  ): OwnDeveloperIdentity => {
    return new OwnDeveloperIdentity(
      serialized.localID,
      parseKeyPair(serialized.keyPair),
      serialized.profile,
    )
  }

  static toJSON = (
    identity: OwnDeveloperIdentity,
  ): OwnDeveloperIdentitySerialized => {
    return {
      localID: identity.localID,
      keyPair: serializeKeyPair(identity.keyPair),
      profile: identity.profile,
    }
  }

  _profile: OwnDeveloperProfile

  constructor(localID: string, keyPair: KeyPair, profile: OwnDeveloperProfile) {
    super(localID, 'dev', keyPair)
    this._profile = profile
  }

  get profile(): OwnDeveloperProfile {
    return this._profile
  }
}
