// @flow

import { MFID } from '@mainframe/data-types'
import { openSigned, verifySignature } from '@mainframe/utils-crypto'

const ID_TYPE = 'user:pub-key:ed25519'

export default class Identity {
  _id: string
  _key: Buffer

  constructor(keyOrID: string | Buffer) {
    if (typeof keyOrID === 'string') {
      const id = new MFID(keyOrID)
      if (id.type.value !== ID_TYPE) {
        throw new Error(
          `Invalid Mainframe ID type: expected ${ID_TYPE}, got ${
            id.type.value
          }`,
        )
      }
      this._id = id.toString()
      this._key = id.data.toBuffer()
    } else {
      this._key = keyOrID
      this._id = MFID.create(ID_TYPE, this._key).toString()
    }
  }

  get id(): string {
    return this._id
  }

  get publicKey(): Buffer {
    return this._key
  }

  verifySignature(message: Buffer, signature: Buffer): boolean {
    return verifySignature(message, signature, this._key)
  }

  openSigned(signed: Buffer): ?Buffer {
    return openSigned(signed, this._key)
  }
}
