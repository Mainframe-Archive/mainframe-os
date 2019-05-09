// @flow

import type Bzz from '@erebos/api-bzz-node'
import { pubKeyToAddress } from '@erebos/keccak256'
import { createKeyPair, type KeyPair } from '@erebos/secp256k1'

export type OwnFeedParams = {
  address?: ?string,
  privateKey: string,
}

export default class OwnFeed {
  static createJSON() {
    const feed = new OwnFeed()
    return feed.toJSON()
  }

  _address: ?string
  keyPair: KeyPair

  constructor(privateKey?: ?string) {
    this.keyPair = createKeyPair(privateKey)
  }

  get address(): string {
    if (this._address == null) {
      this._address = pubKeyToAddress(this.keyPair.getPublic().encode())
    }
    return this._address
  }

  async publishJSON(bzz: Bzz, payload: Object): Promise<string> {
    return await bzz.uploadFeedValue(
      { user: this.address },
      JSON.stringify(payload),
      { contentType: 'application/json' },
      this.keyPair.getPrivate(),
    )
  }

  toJSON() {
    return {
      address: this.address,
      privateKey: this.keyPair.getPrivate('hex'),
    }
  }
}
