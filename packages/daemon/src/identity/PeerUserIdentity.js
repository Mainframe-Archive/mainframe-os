// @flow

import Identity from './Identity'

type FeedTypes = 'public' // TODO: define more types
type FeedHash = string

export type PeerData = {
  name: string,
  avatar?: ?string,
}

export type Feeds = { [type: FeedTypes]: FeedHash }

export type PeerUserIdentitySerialized = {
  id: string,
  feeds: Feeds,
  data: PeerData,
}

export default class PeerUserIdentity extends Identity {
  static fromJSON = (params: PeerUserIdentitySerialized): PeerUserIdentity => {
    return new PeerUserIdentity(params.id, params.data, params.feeds)
  }

  static toJSON = (peer: PeerUserIdentity): PeerUserIdentitySerialized => ({
    id: peer._id,
    feeds: peer._feeds,
    data: {
      name: peer._name,
      avatar: peer._avatar,
    },
  })

  _feeds: Feeds
  _name: string
  _avatar: ?string

  constructor(keyOrId: string | Buffer, data: PeerData, feeds?: Feeds) {
    super(keyOrId)
    this._feeds = feeds || {}
    this._name = data.name
    this._avatar = data.avatar
  }

  get feeds(): Feeds {
    return this._feeds
  }

  get name(): string {
    return this._name
  }

  get avatar(): ?string {
    return this._avatar
  }
}
