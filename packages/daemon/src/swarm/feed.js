// @flow

import elliptic from 'elliptic'

import BzzAPI from '@erebos/api-bzz-node'
import { getFeedTopic } from '@erebos/api-bzz-base'
import { isHexValue, hexValueType, type hexValue } from '@erebos/hex'
import { createKeyPair, type KeyPair as EthKeyPair } from '@erebos/secp256k1'
import { pubKeyToAddress } from '@erebos/keccak256'

const ec = new elliptic.ec('secp256k1')

export type feedHash = string

export type OwnFeedSerialized = {
  ethPrivKey: hexValue,
  topic: hexValue,
  feedHash: ?feedHash,
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
      ec.keyFromPrivate(serialized.ethPrivKey, 'hex'),
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
  _topic: hexValue
  _feedHash: ?feedHash

  constructor(keyPair: EthKeyPair, topic: hexValue, feedHash: ?feedHash) {
    this._keyPair = keyPair
    this._topic = topic
    this._feedHash = feedHash
  }

  get keyPair(): EthKeyPair {
    return this._keyPair
  }

  get topic(): hexValue {
    return this._topic
  }

  get feedHash(): ?feedHash {
    return this._feedHash
  }

  async syncManifest(bzz: BzzAPI): Promise<boolean> {
    if (this.feedHash) return false

    const address = pubKeyToAddress(this.keyPair.getPublic().encode())
    const feedHash = await bzz.createFeedManifest(address, {
      topic: this.topic,
    })
    this._feedHash = feedHash

    return true
  }

  async publishJSON(bzz: BzzAPI, payload: Object): Promise<string> {
    const body = JSON.stringify(payload)
    const dataHash = await bzz.uploadFile(body, {
      contentType: 'application/json',
    })
    await bzz.postFeedValue(this.keyPair, `0x${dataHash}`, {
      topic: this.topic,
    })
    return dataHash
  }
}
