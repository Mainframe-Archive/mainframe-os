// @flow

import {
  decodeMainframeID,
  encodeMainframeID,
  mainframeIDType,
  type MainframeID, // eslint-disable-line import/named
} from '@mainframe/data-types'
import { openSigned, verifySignature } from '@mainframe/utils-crypto'

export default class Identity {
  _id: MainframeID
  _key: Buffer

  constructor(keyOrID: MainframeID | Buffer) {
    if (Buffer.isBuffer(keyOrID)) {
      // $FlowFixMe: Buffer type check not detected by Flow
      const key = (keyOrID: Buffer)
      this._id = encodeMainframeID(key)
      this._key = key
    } else {
      const id = mainframeIDType(keyOrID)
      this._id = id
      this._key = decodeMainframeID(id)
    }
  }

  get id(): MainframeID {
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
