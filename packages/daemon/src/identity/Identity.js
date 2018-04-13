// @flow

import { verifySignature, open } from '../crypto'

export default class Identity {
  _publicKey: Buffer

  constructor(publicKey: Buffer) {
    this._publicKey = publicKey
  }

  get publicKey(): Buffer {
    return this._publicKey
  }

  verify(message: Buffer, signature: Buffer) {
    return verifySignature(message, signature, this._publicKey)
  }

  open(signed: Buffer) {
    return open(signed, this._publicKey)
  }
}
