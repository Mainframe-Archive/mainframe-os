// @flow

import multibase from 'multibase'

const CANONICAL_DATA_ENCODING = 'base64'

const toCanonicalData = (buffer: Buffer): string => {
  const value = buffer.toString(CANONICAL_DATA_ENCODING)
  return `${CANONICAL_DATA_ENCODING}:${value}`
}

const decodeMFID = (input: string): string => {
  if (input.slice(0, 3) === 'mf:') {
    return input
  }

  try {
    const id = multibase.decode(input).toString()
    if (id.slice(0, 3) === 'mf:') {
      return id
    }
  } catch (err) {
    // Invalid multihash
  }
  throw new Error('Invalid MFID')
}

export const isValidMFID = (value: string): boolean => {
  try {
    decodeMFID(value)
    return true
  } catch (err) {
    return false
  }
}

export class MFIDParts {
  _value: string
  _parts: Array<string>

  constructor(value: string) {
    this._value = value
    this._parts = value.split(':')
  }

  get value(): string {
    return this._value
  }

  has(part: string): boolean {
    return this._parts.includes(part)
  }
}

export class MFIDData extends MFIDParts {
  static ENCODINGS = ['base64', 'hex', 'hex-string', 'multibase', 'utf8']
  static PROTOCOLS = ['bzz']

  _type: 'encoding' | 'protocol'

  constructor(value: string) {
    super(value)

    const type = this._parts[0]
    if (MFIDData.ENCODINGS.includes(type)) {
      this._type = 'encoding'
    } else if (MFIDData.PROTOCOLS.includes(type)) {
      this._type = 'protocol'
    } else {
      throw new Error('Invalid MFID data value')
    }
  }

  toBuffer(): Buffer {
    if (this._type !== 'encoding') {
      throw new Error('toBuffer() can only be called for encoded data')
    }

    let buffer
    switch (this._parts[0]) {
      case 'hex-string':
        buffer = Buffer.from(this._parts[1].substr(2), 'hex')
        break
      case 'hex':
        buffer = Buffer.from(this._parts[1], 'hex')
        break
      case 'multibase':
        buffer = multibase.decode(this._parts[1])
        break
      case 'utf8':
        buffer = Buffer.from(this._parts[1], 'utf8')
        break
      default:
        throw new Error('Invalid MFID data value')
    }
    return buffer
  }

  toString(): string {
    return this._type === 'protocol' || this._parts[0] === 'base64'
      ? this.value
      : toCanonicalData(this.toBuffer())
  }

  equals(other: string | MFIDData): boolean {
    const id = other instanceof MFIDData ? other : new MFIDData(other)
    return this.toString() === id.toString()
  }
}

export class MFID {
  static VERSION = 0

  static create = (type: string, value: string | Buffer): MFID => {
    const data = typeof value === 'string' ? value : toCanonicalData(value)
    return new MFID(`mf:${MFID.VERSION}/${type}/${data}`)
  }

  static canonical = (mfid: string | MFID): string => {
    const id = mfid instanceof MFID ? mfid : new MFID(mfid)
    return id.toString()
  }

  _value: string
  version: number
  type: MFIDParts
  data: MFIDData

  constructor(input: string) {
    this._value = decodeMFID(input)
    const [check, type, data] = this._value.split('/')

    const [mf, versionString] = check.split(':')
    if (mf !== 'mf') {
      throw new Error('Invalid MFID')
    }
    this.version = parseInt(versionString, 10)
    if (!Number.isInteger(this.version)) {
      throw new Error('Invalid MFID version')
    }

    this.type = new MFIDParts(type)
    this.data = new MFIDData(data)
  }

  get value(): string {
    return this._value
  }

  has(part: string): boolean {
    return this.type.has(part) || this.data.has(part)
  }

  equals(other: string | MFID): boolean {
    const id = other instanceof MFID ? other : new MFID(other)
    return (
      this.version === id.version &&
      this.type.value === id.type.value &&
      this.data.equals(id.data)
    )
  }

  toString(): string {
    return `mf:${this.version}/${this.type.value}/${this.data.toString()}`
  }

  toMultibase(encoding: string = 'base64url'): Buffer {
    return multibase.encode(encoding, Buffer.from(this.toString()))
  }

  toEncodedString(encoding?: string): string {
    return this.toMultibase(encoding).toString()
  }
}
