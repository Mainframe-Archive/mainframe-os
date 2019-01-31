// @flow

import {
  decodeBase64,
  encodeBase64,
  type base64,
} from '@mainframe/utils-base64'
import {
  createBoxKeyPair,
  createSecretBoxKey,
  createSignKeyPair,
  type KeyPair,
} from '@mainframe/utils-crypto'
import { uniqueID, type ID } from '@mainframe/utils-id'

import { mapObject } from '../utils'

type KeysPairs = { [ID]: KeyPair }
type KeysBuffers = { [ID]: Buffer }

export type KeyPairSerialized = {
  publicKey: base64,
  secretKey: base64,
}

type KeysParams = {
  pairBox?: KeysPairs,
  pairSign?: KeysPairs,
  publicBox?: KeysBuffers,
  publicSign?: KeysBuffers,
  secretBox?: KeysBuffers,
}

type KeysStored = {
  pairBox: KeysPairs,
  pairSign: KeysPairs,
  publicBox: KeysBuffers,
  publicSign: KeysBuffers,
  secretBox: KeysBuffers,
}

type keyBufferType = 'publicBox' | 'publicSign' | 'secretBox'
type keyPairType = 'pairBox' | 'pairSign'
export type keyType = keyBufferType | keyPairType

export type KeychainSerialized = {
  pairBox?: { [ID]: KeyPairSerialized },
  pairSign?: { [ID]: KeyPairSerialized },
  publicBox?: { [ID]: base64 },
  publicSign?: { [ID]: base64 },
  secretBox?: { [ID]: base64 },
}

const parseKeyPair = (serialized: KeyPairSerialized): KeyPair => ({
  publicKey: decodeBase64(serialized.publicKey),
  secretKey: decodeBase64(serialized.secretKey),
})

const serializeKeyPair = (keyPair: KeyPair): KeyPairSerialized => ({
  publicKey: encodeBase64(keyPair.publicKey),
  secretKey: encodeBase64(keyPair.secretKey),
})

const fromKeysPairs = mapObject(serializeKeyPair)
const fromKeysBuffers = mapObject(encodeBase64)
const toKeysPairs = mapObject(parseKeyPair)
const toKeysBuffers = mapObject(decodeBase64)

export default class Keychain {
  static fromJSON = (serialized: KeychainSerialized): Keychain => {
    return new Keychain({
      // $FlowFixMe: mapping types
      pairBox: toKeysPairs(serialized.pairBox),
      // $FlowFixMe: mapping types
      pairSign: toKeysPairs(serialized.pairSign),
      // $FlowFixMe: mapping types
      publicBox: toKeysBuffers(serialized.publicBox),
      // $FlowFixMe: mapping types
      publicSign: toKeysBuffers(serialized.publicSign),
      // $FlowFixMe: mapping types
      secretBox: toKeysBuffers(serialized.secretBox),
    })
  }

  static toJSON = (keychain: Keychain): KeychainSerialized => ({
    // $FlowFixMe: mapping types
    pairBox: fromKeysPairs(keychain.pairBox),
    // $FlowFixMe: mapping types
    pairSign: fromKeysPairs(keychain.pairSign),
    // $FlowFixMe: mapping types
    publicBox: fromKeysBuffers(keychain.publicBox),
    // $FlowFixMe: mapping types
    publicSign: fromKeysBuffers(keychain.publicSign),
    // $FlowFixMe: mapping types
    secretBox: fromKeysBuffers(keychain.secretBox),
  })

  _keys: KeysStored
  _refs: { [ID]: keyType }

  constructor(keys: KeysParams = {}) {
    this._keys = {
      pairBox: keys.pairBox == null ? {} : keys.pairBox,
      pairSign: keys.pairSign == null ? {} : keys.pairSign,
      publicBox: keys.publicBox == null ? {} : keys.publicBox,
      publicSign: keys.publicSign == null ? {} : keys.publicSign,
      secretBox: keys.secretBox == null ? {} : keys.secretBox,
    }

    this._refs = Object.keys(this._keys).reduce((acc, type: keyType) => {
      Object.keys(this._keys[type]).forEach(key => (acc[key] = type))
      return acc
    }, {})
  }

  get pairBox(): KeysPairs {
    return this._keys.pairBox
  }

  get pairSign(): KeysPairs {
    return this._keys.pairSign
  }

  get publicBox(): KeysBuffers {
    return this._keys.publicBox
  }

  get publicSign(): KeysBuffers {
    return this._keys.publicSign
  }

  get secretBox(): KeysBuffers {
    return this._keys.secretBox
  }

  addKey(type: keyBufferType, key: Buffer): ID {
    const id = uniqueID()
    this._refs[id] = type
    this._keys[type][id] = key
    return id
  }

  addKeyPair(type: keyPairType, keyPair: KeyPair): ID {
    const id = uniqueID()
    this._refs[id] = type
    this._keys[type][id] = keyPair
    return id
  }

  addPairBox(keyPair: KeyPair): ID {
    return this.addKeyPair('pairBox', keyPair)
  }

  addPairSign(keyPair: KeyPair): ID {
    return this.addKeyPair('pairSign', keyPair)
  }

  addPublicBox(key: Buffer): ID {
    return this.addKey('publicBox', key)
  }

  addPublicSign(key: Buffer): ID {
    return this.addKey('publicSign', key)
  }

  addSecretBox(key: Buffer): ID {
    return this.addKey('secretBox', key)
  }

  createPairBox(seed?: Buffer): ID {
    return this.addPairBox(createBoxKeyPair(seed))
  }

  createPairSign(seed?: Buffer): ID {
    return this.addPairSign(createSignKeyPair(seed))
  }

  createSecretBox(): ID {
    return this.addSecretBox(createSecretBoxKey())
  }

  getPairBox(id?: ID): ?KeyPair {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._keys.pairBox)[0]
      : this._keys.pairBox[id]
  }

  getPairSign(id?: ID): ?KeyPair {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._keys.pairSign)[0]
      : this._keys.pairSign[id]
  }

  getPublicBox(id?: ID): ?Buffer {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._keys.publicBox)[0]
      : this._keys.publicBox[id]
  }

  getPublicSign(id?: ID): ?Buffer {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._keys.publicSign)[0]
      : this._keys.publicSign[id]
  }

  getSecretBox(id?: ID): ?Buffer {
    return id == null
      ? // $FlowFixMe: return type
        Object.values(this._keys.secretBox)[0]
      : this._keys.secretBox[id]
  }

  removeKey(id: ID): boolean {
    const type = this._refs[id]
    if (type == null) {
      return false
    }

    delete this._keys[type][id]
    delete this._refs[id]
    return true
  }
}
