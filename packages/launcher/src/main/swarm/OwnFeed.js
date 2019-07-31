// @flow

import type { FeedParams } from '@erebos/api-bzz-base'
import type Bzz from '@erebos/api-bzz-node'
import { pubKeyToAddress } from '@erebos/keccak256'
import { createKeyPair, type KeyPair } from '@erebos/secp256k1'

export default class OwnFeed {
  static createJSON() {
    const feed = new OwnFeed()
    return feed.toJSON()
  }

  _address: ?string
  _feed: ?FeedParams
  keyPair: KeyPair

  constructor(privateKey?: ?string, feed?: ?$Shape<FeedParams>) {
    this.keyPair = createKeyPair(privateKey)
    if (feed != null) {
      this._feed = feed
      if (this._feed.user == null) {
        this._feed.user = this.address
      }
    }
  }

  get address(): string {
    if (this._address == null) {
      this._address = pubKeyToAddress(this.keyPair.getPublic().encode())
    }
    return this._address
  }

  get feed(): FeedParams {
    return this._feed || { user: this.address }
  }

  async getContentHash(bzz: Bzz): Promise<string | null> {
    return await bzz.getFeedContentHash(this.feed)
  }

  async setContentHash(bzz: Bzz, hash: string): Promise<void> {
    return await bzz.setFeedContentHash(
      this.feed,
      hash,
      {},
      this.keyPair.getPrivate(),
    )
  }

  async publishContent(
    bzz: Bzz,
    content: any,
    options?: Object = {},
  ): Promise<string> {
    return await bzz.setFeedContent(
      this.feed,
      content,
      options,
      this.keyPair.getPrivate(),
    )
  }

  async publishJSON(bzz: Bzz, payload: Object): Promise<string> {
    return await this.publishContent(bzz, JSON.stringify(payload), {
      mode: 'raw',
    })
  }

  toJSON() {
    return {
      address: this.address,
      privateKey: this.keyPair.getPrivate('hex'),
    }
  }
}
