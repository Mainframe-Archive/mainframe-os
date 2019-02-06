// @flow

// eslint-disable-next-line import/named
import { createSignKeyPair, type KeyPair } from '@mainframe/utils-crypto'
import { uniqueID } from '@mainframe/utils-id'

import { OwnFeed, type OwnFeedSerialized } from '../swarm/feed'
import OwnIdentity, {
  parseKeyPair,
  serializeKeyPair,
  type KeyPairSerialized,
} from './OwnIdentity'
import { type PublicFeedSerialized } from './PeerUserIdentity'

export type OwnUserProfile = {
  name: string,
  avatar?: ?string,
  ethAddress?: ?string,
}

export type OwnUserIdentitySerialized = {
  localID: string,
  keyPair: KeyPairSerialized,
  profile: OwnUserProfile,
  publicFeed: OwnFeedSerialized,
  firstContactFeed: OwnFeedSerialized,
  privateProfile: boolean,
}

export type OwnUserIdentityParams = {
  localID: string,
  keyPair: KeyPair,
  profile: OwnUserProfile,
  publicFeed: OwnFeed,
  firstContactFeed: OwnFeed,
  privateProfile: boolean,
}

export default class OwnUserIdentity extends OwnIdentity {
  static create = (
    profile: OwnUserProfile,
    privateProfile?: boolean,
    keyPair?: KeyPair,
    localID?: string,
  ): OwnUserIdentity => {
    return new OwnUserIdentity({
      localID: localID || uniqueID(),
      keyPair: keyPair || createSignKeyPair(),
      profile,
      publicFeed: OwnFeed.create(undefined, 'mf-identity-public-feed'),
      firstContactFeed: OwnFeed.create(),
      privateProfile: !!privateProfile,
    })
  }

  static fromJSON = (serialized: OwnUserIdentitySerialized): OwnUserIdentity =>
    new OwnUserIdentity({
      localID: serialized.localID,
      keyPair: parseKeyPair(serialized.keyPair),
      profile: serialized.profile,
      publicFeed: OwnFeed.fromJSON(serialized.publicFeed),
      firstContactFeed: OwnFeed.fromJSON(serialized.firstContactFeed),
      privateProfile: serialized.privateProfile,
    })

  static toJSON = (identity: OwnUserIdentity): OwnUserIdentitySerialized => ({
    localID: identity.localID,
    keyPair: serializeKeyPair(identity.keyPair),
    profile: identity.profile,
    publicFeed: OwnFeed.toJSON(identity.publicFeed),
    firstContactFeed: OwnFeed.toJSON(identity.firstContactFeed),
    privateProfile: identity._privateProfile,
  })

  _profile: OwnUserProfile
  _publicFeed: OwnFeed
  _firstContactFeed: OwnFeed
  _privateProfile: boolean

  constructor(params: OwnUserIdentityParams) {
    super(params.localID, 'user', params.keyPair)
    this._profile = params.profile
    this._publicFeed = params.publicFeed
    this._firstContactFeed = params.firstContactFeed
    this._privateProfile = params.privateProfile
  }

  get profile(): OwnUserProfile {
    return this._profile
  }

  set profile(profile: OwnUserProfile) {
    this._profile = profile
  }

  get publicFeed(): OwnFeed {
    return this._publicFeed
  }

  get firstContactFeed(): OwnFeed {
    return this._firstContactFeed
  }

  get privateProfile(): boolean {
    return this._privateProfile
  }

  set privateProfile(setPrivate: boolean) {
    this._privateProfile = setPrivate
  }

  publicFeedData(): PublicFeedSerialized {
    const { name, avatar, ethAddress } = this.profile

    return {
      publicKey: this.base64PublicKey(),
      profile: this.privateProfile ? {} : { name, avatar, ethAddress },
      firstContactAddress: this.firstContactFeed.address,
    }
  }
}
