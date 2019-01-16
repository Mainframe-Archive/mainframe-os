// @flow

import crypto from 'crypto'
import BzzAPI from '@erebos/api-bzz-node'
import { getFeedTopic } from '@erebos/api-bzz-base'
import { isHexValue, hexValueType, type hexValue } from '@erebos/hex'
import { createKeyPair, type KeyPair as EthKeyPair } from '@erebos/secp256k1'
import { pubKeyToAddress } from '@erebos/keccak256'

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
  _address: hexValue
  _topic: hexValue
  _feedHash: ?bzzHash

  constructor(keyPair: EthKeyPair, topic: hexValue, feedHash: ?bzzHash) {
    this._keyPair = keyPair
    this._topic = topic
    this._feedHash = feedHash
    // $FlowFixMe: pubKeyToAddress inferred as string type rather then erebos hexValue
    this._address = pubKeyToAddress(keyPair.getPublic().encode())
  }

  get keyPair(): EthKeyPair {
    return this._keyPair
  }

  get address(): hexValue {
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
