// @flow

// eslint-disable-next-line import/named
import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'
import { uniqueID } from '@mainframe/utils-id'
import multibase from 'multibase'

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
}

export type PublicFeedSerialized = {
  publicKey: string,
  profile?: PeerUserProfile,
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
    )
  }

  static fromJSON = (
    serialized: OwnUserIdentitySerialized,
  ): OwnUserIdentity => {
    return new OwnUserIdentity(
      serialized.localID,
      parseKeyPair(serialized.keyPair),
      serialized.profile,
      OwnFeed.fromJSON(serialized.publicFeed),
    )
  }

  static toJSON = (identity: OwnUserIdentity): OwnUserIdentitySerialized => {
    return {
      localID: identity.localID,
      keyPair: serializeKeyPair(identity.keyPair),
      profile: identity.profile,
      publicFeed: OwnFeed.toJSON(identity.publicFeed),
    }
  }

  _profile: Object
  _publicFeed: OwnFeed

  constructor(
    localID: string,
    keyPair: KeyPair,
    profile: Object = {},
    publicFeed: OwnFeed,
  ) {
    super(localID, 'user', keyPair)
    this._profile = profile
    this._publicFeed = publicFeed
  }

  get profile(): OwnUserProfile {
    return this._profile
  }

  get publicFeed(): OwnFeed {
    return this._publicFeed
  }

  get publicFeedData(): PublicFeedSerialized {
    const { name, avatar } = this.profile

    return {
      publicKey: multibase.encode('base64', this.keyPair.publicKey).toString(),
      profile: { name, avatar },
    }
  }
}
