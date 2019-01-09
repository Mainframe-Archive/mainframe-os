// @flow

import Identity from './Identity'

type FeedHash = string

export type ProfileData = {
  name?: ?string,
  avatar?: ?string,
}

export type Feeds = { [type: string]: FeedHash }

export type PeerUserIdentitySerialized = {
  id: string,
  localID: string,
  profile: ProfileData,
  publicFeed: FeedHash,
  otherFeeds?: Feeds,
}

export type PeerUserIdentityParams = PeerUserIdentitySerialized

export default class PeerUserIdentity extends Identity {
  static fromJSON = (params: PeerUserIdentitySerialized): PeerUserIdentity => {
    return new PeerUserIdentity({
      id: params.id,
      localID: params.localID,
      profile: params.profile,
      publicFeed: params.publicFeed,
      otherFeeds: params.otherFeeds,
    })
  }

  static toJSON = (peer: PeerUserIdentity): PeerUserIdentitySerialized => ({
    id: peer._id,
    localID: peer.localID,
    profile: peer._profile,
    publicFeed: peer._publicFeed,
    otherFeeds: peer._otherFeeds,
  })

  _publicFeed: FeedHash
  _otherFeeds: Feeds
  _profile: {
    name?: ?string,
    avatar?: ?string,
  }

  constructor(params: PeerUserIdentityParams) {
    super(params.localID, 'user', params.id)
    this._publicFeed = params.publicFeed
    this._otherFeeds = params.otherFeeds || {}
    this._profile = params.profile
  }

  get publicFeed(): FeedHash {
    return this._publicFeed
  }

  get profile(): ProfileData {
    return this._profile
  }

  get otherFeeds(): Feeds {
    return this._otherFeeds
  }

  get name(): ?string {
    return this._profile.name
  }

  get avatar(): ?string {
    return this._profile.avatar
  }
}
