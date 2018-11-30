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
  publicFeed: FeedHash,
  otherFeeds: Feeds,
  profile: ProfileData,
}

export default class PeerUserIdentity extends Identity {
  static fromJSON = (params: PeerUserIdentitySerialized): PeerUserIdentity => {
    return new PeerUserIdentity(
      params.id,
      params.profile,
      params.publicFeed,
      params.otherFeeds,
    )
  }

  static toJSON = (peer: PeerUserIdentity): PeerUserIdentitySerialized => ({
    id: peer._id,
    publicFeed: peer._publicFeed,
    otherFeeds: peer._otherFeeds,
    profile: peer._profile,
  })

  _publicFeed: FeedHash
  _otherFeeds: Feeds
  _profile: {
    name?: ?string,
    avatar?: ?string,
  }

  constructor(
    keyOrId: string | Buffer,
    profile: ProfileData,
    publicFeed: FeedHash,
    otherFeeds?: Feeds,
  ) {
    super('user', keyOrId)
    this._publicFeed = publicFeed
    this._otherFeeds = otherFeeds || {}
    this._profile = profile
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
