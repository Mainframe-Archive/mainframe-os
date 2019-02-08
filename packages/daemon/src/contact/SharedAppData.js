// @flow

import BzzAPI from '@erebos/api-bzz-node'

import {
  OwnFeed,
  BidirectionalFeed,
  randomTopic,
  type OwnFeedSerialized,
  type BidirectionalFeedSerialized,
  type bzzHash,
} from '../swarm/feed'
import { mapObject } from '../utils'

export type JsonFeed = {
  type: 'json',
  feed: OwnFeed,
}

type JsonFeedSerialized = {
  type: 'json',
  feed: OwnFeedSerialized,
}

export type TypedFeed = JsonFeed
type TypedFeedSerialized = JsonFeedSerialized
export type FeedType = $PropertyType<TypedFeed, 'type'>

type AppFeeds = { [string]: TypedFeed }
type AppFeedsSerialized = $ObjMap<AppFeeds, (TypedFeed) => TypedFeedSerialized>

const fromAppFeeds = mapObject(
  (f: TypedFeed): TypedFeedSerialized => ({
    type: f.type,
    feed: OwnFeed.toJSON(f.feed),
  }),
)

const toAppFeeds = mapObject(
  (f: TypedFeedSerialized): TypedFeed => ({
    type: f.type,
    feed: OwnFeed.fromJSON(f.feed),
  }),
)

export type AppFeedsPayload = {
  [string]: { type: FeedType, feedHash: bzzHash },
}

const toAppFeedsPayload = mapObject((f: TypedFeed) => ({
  type: f.type,
  feedHash: f.feed.feedHash,
}))

export type SharedAppDataPayload = {
  version: string,
  feeds: AppFeedsPayload,
}

export type SharedAppDataSerialized = {
  sharedFeed: BidirectionalFeedSerialized,
  appFeeds: AppFeedsSerialized,
}

export default class SharedAppData {
  static create = (optional?: {
    localFeed?: OwnFeed,
    remoteFeed?: bzzHash,
  }): SharedAppData => {
    return new SharedAppData(BidirectionalFeed.create(optional), {})
  }

  static fromJSON = (serialized: SharedAppDataSerialized): SharedAppData =>
    new SharedAppData(
      BidirectionalFeed.fromJSON(serialized.sharedFeed),
      // $FlowFixMe: mapping type
      toAppFeeds(serialized.appFeeds),
    )

  static toJSON = (sharedAppData: SharedAppData): SharedAppDataSerialized => ({
    sharedFeed: BidirectionalFeed.toJSON(sharedAppData.sharedFeed),
    // $FlowFixMe: mapping type
    appFeeds: fromAppFeeds(sharedAppData._appFeeds),
  })

  _sharedFeed: BidirectionalFeed
  _appFeeds: AppFeeds

  constructor(sharedFeed: BidirectionalFeed, appFeeds: AppFeeds) {
    this._sharedFeed = sharedFeed
    this._appFeeds = appFeeds
  }

  get sharedFeed(): BidirectionalFeed {
    return this._sharedFeed
  }

  get feedHash(): ?bzzHash {
    return this.sharedFeed.localFeed.feedHash
  }

  get remoteFeed(): ?bzzHash {
    return this.sharedFeed.remoteFeed
  }

  set remoteFeed(remoteFeed: bzzHash) {
    this.sharedFeed.remoteFeed = remoteFeed
  }

  getAppFeed(key: string): ?TypedFeed {
    return this._appFeeds[key]
  }

  createAppFeed(type: FeedType, key: string): TypedFeed {
    if (this._appFeeds[key]) throw new Error('App feed key already exists')

    switch (type) {
      case 'json': {
        const feed = { type, feed: OwnFeed.create(undefined, randomTopic()) }
        this._appFeeds[key] = feed
        return feed
      }

      default:
        throw new Error(`Unexpected feed type ${type}`)
    }
  }

  async syncManifest(bzz: BzzAPI): Promise<boolean> {
    return this.sharedFeed.syncManifest(bzz)
  }

  async publish(bzz: BzzAPI): Promise<string> {
    return this.sharedFeed.publish(bzz, this._generateFeedPayload())
  }

  _generateFeedPayload(): SharedAppDataPayload {
    return {
      version: '1.0.0',
      // $FlowFixMe: mapping type
      feeds: toAppFeedsPayload(this._appFeeds),
    }
  }
}
