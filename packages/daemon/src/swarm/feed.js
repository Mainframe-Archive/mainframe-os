// @flow

import crypto from 'crypto'
import BzzAPI, {
  type DownloadOptions,
  type PollOptions,
} from '@erebos/api-bzz-node'
import { getFeedTopic } from '@erebos/api-bzz-base'
import { isHexValue, hexValueType, type hexValue } from '@erebos/hex'
import { createKeyPair, type KeyPair as EthKeyPair } from '@erebos/secp256k1'
import { pubKeyToAddress } from '@erebos/keccak256'
import type { Observable } from 'rxjs'
import { flatMap } from 'rxjs/operators'

export type bzzHash = string

export const randomTopic = (): hexValue => {
  return hexValueType('0x' + crypto.randomBytes(32).toString('hex'))
}

export type OwnFeedSerialized = {
  ethPrivKey: hexValue,
  topic: hexValue,
  feedHash: ?bzzHash,
}

export class OwnFeed {
  static create = (keyPair?: EthKeyPair, topicOrName?: string): OwnFeed => {
    let topic = topicOrName
    if (!isHexValue(topicOrName)) {
      topic = getFeedTopic({ name: topicOrName })
    }

    return new OwnFeed(keyPair || createKeyPair(), hexValueType(topic))
  }

  static fromJSON = (serialized: OwnFeedSerialized): OwnFeed => {
    return new OwnFeed(
      createKeyPair(serialized.ethPrivKey, 'hex'),
      serialized.topic,
      serialized.feedHash,
    )
  }

  static toJSON = (feed: OwnFeed): OwnFeedSerialized => {
    return {
      ethPrivKey: feed.keyPair.getPrivate('hex'),
      topic: feed.topic,
      feedHash: feed.feedHash,
    }
  }

  _keyPair: EthKeyPair
  _address: ?hexValue
  _topic: hexValue
  _feedHash: ?bzzHash

  constructor(keyPair: EthKeyPair, topic: hexValue, feedHash: ?bzzHash) {
    this._keyPair = keyPair
    this._topic = topic
    this._feedHash = feedHash
  }

  get keyPair(): EthKeyPair {
    return this._keyPair
  }

  get address(): hexValue {
    if (this._address == null) {
      this._address = pubKeyToAddress(this._keyPair.getPublic().encode())
    }
    return this._address
  }

  get topic(): hexValue {
    return this._topic
  }

  get feedHash(): ?bzzHash {
    return this._feedHash
  }

  async syncManifest(bzz: BzzAPI): Promise<boolean> {
    if (this.feedHash) return false

    const feedHash = await bzz.createFeedManifest(this.address, {
      topic: this.topic,
    })
    this._feedHash = feedHash

    return true
  }

  async publishJSON(bzz: BzzAPI, payload: Object): Promise<string> {
    return await bzz.uploadFeedValue(
      this.address,
      JSON.stringify(payload),
      { topic: this.topic },
      { contentType: 'application/json' },
      this.keyPair.getPrivate(),
    )
  }
}

export const fetchJSON = <T: Object>(
  bzz: BzzAPI,
  hash: bzzHash,
  options?: DownloadOptions,
): Promise<T> => {
  return bzz.download(hash, options).then(res => res.json())
}

export const pollFeedJSON = <T: Object>(
  bzz: BzzAPI,
  hash: bzzHash,
  options: PollOptions,
): Observable<T> => {
  return bzz
    .pollFeedValue(hash, {
      mode: 'content-response',
      whenEmpty: 'ignore',
      contentChangedOnly: true,
      ...options,
    })
    .pipe(flatMap(res => res.json()))
}

export type BidirectionalFeedSerialized = {
  localFeed: OwnFeedSerialized,
  localFeedData: ?Object,
  remoteFeed: ?bzzHash,
}

export class BidirectionalFeed {
  static create = (optional?: {
    localFeed?: OwnFeed,
    remoteFeed?: bzzHash,
  }): BidirectionalFeed => {
    return new BidirectionalFeed(
      (optional && optional.localFeed) ||
        OwnFeed.create(undefined, randomTopic()),
      optional && optional.remoteFeed,
    )
  }

  static fromJSON = (
    serialized: BidirectionalFeedSerialized,
  ): BidirectionalFeed =>
    new BidirectionalFeed(
      OwnFeed.fromJSON(serialized.localFeed),
      serialized.remoteFeed,
      serialized.localFeedData,
    )

  static toJSON = (
    bidirectionalFeed: BidirectionalFeed,
  ): BidirectionalFeedSerialized => ({
    localFeed: OwnFeed.toJSON(bidirectionalFeed.localFeed),
    localFeedData: bidirectionalFeed._localFeedData,
    remoteFeed: bidirectionalFeed.remoteFeed,
  })

  _localFeed: OwnFeed
  _localFeedData: ?Object
  _remoteFeed: ?bzzHash

  constructor(
    localFeed: OwnFeed,
    remoteFeed?: ?bzzHash,
    localFeedData?: ?Object,
  ) {
    this._localFeed = localFeed
    this._localFeedData = localFeedData
    this._remoteFeed = remoteFeed
  }

  get localFeed(): OwnFeed {
    return this._localFeed
  }

  // Lazily read this from local feed instead of serializing?
  get localFeedData(): Object {
    return this._localFeedData || {}
  }

  set localFeedData(data: Object) {
    this._localFeedData = data
  }

  get remoteFeed(): ?bzzHash {
    return this._remoteFeed
  }

  set remoteFeed(remoteFeed: bzzHash) {
    this._remoteFeed = remoteFeed
  }

  async syncManifest(bzz: BzzAPI): Promise<boolean> {
    return this.localFeed.syncManifest(bzz)
  }

  async publish(bzz: BzzAPI, data: Object): Promise<string> {
    return this.localFeed.publishJSON(bzz, data)
  }

  async publishLocalData(bzz: BzzAPI): Promise<string> {
    return this.publish(bzz, this.localFeedData)
  }

  pollRemoteData<T: Object>(bzz: BzzAPI, options: PollOptions): Observable<T> {
    if (this.remoteFeed == null) {
      throw new Error('Failed to poll remote feed, hash unknown')
    }

    return pollFeedJSON(bzz, this.remoteFeed, options)
  }
}
