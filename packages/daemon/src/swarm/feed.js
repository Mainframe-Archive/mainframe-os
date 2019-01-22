// @flow

import crypto from 'crypto'
import BzzAPI, { type PollOptions } from '@erebos/api-bzz-node'
import { getFeedTopic } from '@erebos/api-bzz-base'
import { isHexValue, hexValueType, type hexValue } from '@erebos/hex'
import { createKeyPair, type KeyPair as EthKeyPair } from '@erebos/secp256k1'
import { pubKeyToAddress } from '@erebos/keccak256'
import type { Observable } from 'rxjs'
import { flatMap } from 'rxjs/operators'

export type bzzHash = string

export type OwnFeedSerialized = {
  ethPrivKey: hexValue,
  topic: hexValue,
  feedHash: ?bzzHash,
}

export const randomTopic = (): hexValue => {
  return hexValueType('0x' + crypto.randomBytes(32).toString('hex'))
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

export class PeerFeed {
  _bzz: BzzAPI
  _hash: string

  constructor(bzz: BzzAPI, hash: string) {
    this._bzz = bzz
    this._hash = hash
  }

  pollJSON<T: Object>(options: PollOptions): Observable<T> {
    return this._bzz
      .pollFeedValue(this._hash, {
        mode: 'content-value',
        whenEmpty: 'ignore',
        contentChangedOnly: true,
        ...options,
      })
      .pipe(flatMap(res => res.json()))
  }
}
