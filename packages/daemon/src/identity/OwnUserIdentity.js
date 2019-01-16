// @flow

// eslint-disable-next-line import/named
import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'
import { uniqueID } from '@mainframe/utils-id'
import multibase from 'multibase'
import { type hexValue } from '@erebos/hex'

import { OwnFeed, type OwnFeedSerialized } from '../swarm/feed.js'
import OwnIdentity, {
  parseKeyPair,
  serializeKeyPair,
  type KeyPairSerialized,
} from './OwnIdentity'
import { type PeerUserProfile } from './PeerUserIdentity.js'

export type OwnUserProfile = {
  name: string,
  avatar?: ?string,
}

export type OwnUserIdentitySerialized = {
  localID: string,
  keyPair: KeyPairSerialized,
  profile?: OwnUserProfile,
  publicFeed: OwnFeedSerialized,
  firstContactFeed: OwnFeedSerialized,
}

export type PublicFeedSerialized = {
  publicKey: string,
  profile?: PeerUserProfile,
  firstContactAddress: hexValue,
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
      OwnFeed.create(undefined, 'mf-identity-public-feed'),
      OwnFeed.create(),
    )
  }

  static fromJSON = (serialized: OwnUserIdentitySerialized): OwnUserIdentity =>
    new OwnUserIdentity(
      serialized.localID,
      parseKeyPair(serialized.keyPair),
      serialized.profile,
      OwnFeed.fromJSON(serialized.publicFeed),
      OwnFeed.fromJSON(serialized.firstContactFeed),
    )

  static toJSON = (identity: OwnUserIdentity): OwnUserIdentitySerialized => ({
    localID: identity.localID,
    keyPair: serializeKeyPair(identity.keyPair),
    profile: identity.profile,
    publicFeed: OwnFeed.toJSON(identity.publicFeed),
    firstContactFeed: OwnFeed.toJSON(identity.firstContactFeed),
  })

  _profile: Object
  _publicFeed: OwnFeed
  _firstContactFeed: OwnFeed

  constructor(
    localID: string,
    keyPair: KeyPair,
    profile: Object = {},
    publicFeed: OwnFeed,
    firstContactFeed: OwnFeed,
  ) {
    super(localID, 'user', keyPair)
    this._profile = profile
    this._publicFeed = publicFeed
    this._firstContactFeed = firstContactFeed
  }

  get profile(): OwnUserProfile {
    return this._profile
  }

  get publicFeed(): OwnFeed {
    return this._publicFeed
  }

  get firstContactFeed(): OwnFeed {
    return this._firstContactFeed
  }

  get publicFeedData(): PublicFeedSerialized {
    const { name, avatar } = this.profile

    return {
      publicKey: multibase.encode('base64', this.keyPair.publicKey).toString(),
      profile: { name, avatar },
      firstContactAddress: this.firstContactFeed.address,
    }
  }
}
