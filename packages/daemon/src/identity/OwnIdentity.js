// @flow

import { createSignKeyPair, getSignature, sign, type KeyPair } from '../crypto'
import {
  uniqueID,
  fromBase64,
  toBase64,
  type base64,
  typeID,
  type ID,
} from '../utils'

import Identity from './Identity'

export type OwnIdentitySerialized = {
  id: string,
  publicKey: base64,
  secretKey: base64,
}

export default class OwnIdentity extends Identity {
  static create(seed?: Buffer) {
    return new OwnIdentity(uniqueID(), createSignKeyPair(seed))
  }

  static hydrate = (params: OwnIdentitySerialized): OwnIdentity => {
    return new OwnIdentity(typeID(params.id), {
      publicKey: fromBase64(params.publicKey),
      secretKey: fromBase64(params.secretKey),
    })
  }

  static serialize = (identiy: OwnIdentity): OwnIdentitySerialized => {
    return identiy.serialized()
  }

  _id: ID
  _secretKey: Buffer

  constructor(id: ID, keyPair: KeyPair) {
    super(keyPair.publicKey)
    this._id = id
    this._secretKey = keyPair.secretKey
  }

  get id(): ID {
    return this._id
  }

  get keyPair(): KeyPair {
    return {
      publicKey: this.publicKey,
      secretKey: this._secretKey,
    }
  }

  getSignature(message: Buffer) {
    return getSignature(message, this._secretKey)
  }

  sign(message: Buffer) {
    return sign(message, this._secretKey)
  }

  serialized(): OwnIdentitySerialized {
    return {
      id: this._id,
      publicKey: toBase64(this._publicKey),
      secretKey: toBase64(this._secretKey),
    }
  }
}
