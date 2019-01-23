// @flow

import { MFID } from '@mainframe/data-types'
import { openSigned, verifySignature } from '@mainframe/utils-crypto'
import multibase from 'multibase'

const KEY_TYPE = 'pub-key:ed25519'

export default class Identity {
  _id: string
  _localID: string
  _key: Buffer

  constructor(localID: string, idType: string, keyOrID: string | Buffer) {
    const type = `${idType}:${KEY_TYPE}`
    this._localID = localID
    if (typeof keyOrID === 'string') {
      const id = new MFID(keyOrID)
      if (id.type.value !== type) {
        throw new Error(
          `Invalid Mainframe ID type: expected ${type}, got ${id.type.value}`,
        )
      }
      this._id = id.toString()
      this._key = id.data.toBuffer()
    } else {
      this._key = keyOrID
      this._id = MFID.create(type, this._key).toString()
    }
  }

  get id(): string {
    return this._id
  }

  get localID(): string {
    return this._localID
  }

  get publicKey(): Buffer {
    return this._key
  }

  base64PublicKey(): string {
    return multibase.encode('base64', this.publicKey).toString()
  }

  verifySignature(message: Buffer, signature: Buffer): boolean {
    return verifySignature(message, signature, this._key)
  }

  openSigned(signed: Buffer): ?Buffer {
    return openSigned(signed, this._key)
  }
}
