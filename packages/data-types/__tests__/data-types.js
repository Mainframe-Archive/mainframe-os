import multibase from 'multibase'

import { isValidMFID, MFIDParts, MFIDData, MFID } from '..'

describe('data-types', () => {
  const mbencoded = multibase.encode('base64url', 'test')

  it('isValidMFID() checks if a string is a valid MFID', () => {
    const id = MFID.create('user:test', 'utf8:bob').toString()
    expect(isValidMFID(id)).toBe(true)
    expect(isValidMFID('other')).toBe(false)
  })

  describe('MFIDParts', () => {
    it('provides the `value` field', () => {
      const parts = new MFIDParts('user:test')
      expect(parts.value).toBe('user:test')
    })

    it('provides a has() method', () => {
      const parts = new MFIDParts('user:test')
      expect(parts.has('user')).toBe(true)
      expect(parts.has('not')).toBe(false)
    })
  })

  describe('MFIDData', () => {
    it('validates the input', () => {
      expect(() => new MFIDData('test')).toThrow('Invalid MFID data value')
      const valid = new MFIDData('bzz:<hash>')
      expect(valid.value).toBe('bzz:<hash>')
    })

    it('provides a toBuffer() method', () => {
      const id = new MFIDData('utf8:test')
      expect(Buffer.from('test').equals(id.toBuffer())).toBe(true)
    })

    it('toBuffer() can only be called for encoded data', () => {
      const id = new MFIDData('bzz:<hash>')
      expect(() => id.toBuffer()).toThrow(
        'toBuffer() can only be called for encoded data',
      )
    })

    it('provides a toString() method to normalise the value', () => {
      const id = new MFIDData('utf8:test')
      const str = id.toString()
      expect(str).toBe('base64:dGVzdA==')
    })

    it('provides an equals() method to compare values', () => {
      const id = new MFIDData('utf8:test')
      expect(id.equals('utf8:test')).toBe(true)
      expect(id.equals('base64:dGVzdA==')).toBe(true)
      expect(id.equals('hex-string:0x74657374')).toBe(true)
      expect(id.equals(`multibase:${mbencoded}`)).toBe(true)
      expect(id.equals('hex:84657374')).toBe(false)
      expect(id.equals('utf8:other')).toBe(false)
      const other = new MFIDData('base64:dGVzdA==')
      expect(id.equals(other)).toBe(true)
    })
  })

  describe('MFID', () => {
    it('validates the input', () => {
      expect(() => new MFID('test')).toThrow('Invalid MFID')
      expect(() => new MFID('mf:a')).toThrow('Invalid MFID version')

      const valid = new MFID('mf:0/test/utf8:test')
      expect(valid.value).toBe('mf:0/test/utf8:test')
    })

    it('provides a has() method checking the type and data parts', () => {
      const id = new MFID('mf:0/test/utf8:hello')
      expect(id.has('test')).toBe(true)
      expect(id.has('hello')).toBe(true)
      expect(id.has('world')).toBe(false)
    })

    it('provides a toString() method to normalise the value', () => {
      const id = new MFID('mf:0/test/utf8:test')
      const str = id.toString()
      expect(str).toBe('mf:0/test/base64:dGVzdA==')
    })

    it('provides an equals() method to compare values', () => {
      const id = new MFID('mf:0/test/utf8:test')
      expect(id.equals('mf:0/test/utf8:test')).toBe(true)
      expect(id.equals('mf:0/test/base64:dGVzdA==')).toBe(true)
      expect(id.equals('mf:0/test/hex-string:0x74657374')).toBe(true)
      expect(id.equals(`mf:0/test/multibase:${mbencoded}`)).toBe(true)
      expect(id.equals('mf:0/test/hex:84657374')).toBe(false)
      expect(id.equals('mf:0/test/utf8:other')).toBe(false)
      const other = new MFID('mf:0/test/base64:dGVzdA==')
      expect(id.equals(other)).toBe(true)
    })

    it('provides a toMultibase() method', () => {
      const id = new MFID('mf:0/test/utf8:test')
      const defaultEncoding = id.toMultibase()
      expect(multibase.isEncoded(defaultEncoding)).toBe('base64url')
      const otherEncoding = id.toMultibase('base58btc')
      expect(multibase.isEncoded(otherEncoding)).toBe('base58btc')
    })

    it('provides a toEncodedString() method', () => {
      const id = new MFID('mf:0/test/utf8:test')
      const defaultEncoding = id.toEncodedString()
      expect(multibase.isEncoded(defaultEncoding)).toBe('base64url')
      const otherEncoding = id.toEncodedString('base58btc')
      expect(multibase.isEncoded(otherEncoding)).toBe('base58btc')
    })

    it('supports creating a MFID from a multibase', () => {
      const id = new MFID('mf:0/test/utf8:test')
      const encoded = id.toEncodedString('base58btc')
      const other = new MFID(encoded)
      expect(id.equals(other)).toBe(true)
    })

    it('provides a create() static method', () => {
      const fromString = MFID.create('test', 'utf8:hello')
      expect(fromString instanceof MFID).toBe(true)
      expect(fromString.value).toBe('mf:0/test/utf8:hello')

      const fromBuffer = MFID.create('test', Buffer.from('test'))
      expect(fromBuffer instanceof MFID).toBe(true)
      expect(fromBuffer.value).toBe('mf:0/test/base64:dGVzdA==')
    })

    it('provides a canonical() static method', () => {
      const idString = 'mf:0/test/utf8:test'
      const id = new MFID(idString)
      const encoded = id.toEncodedString('base58btc')
      const expected = 'mf:0/test/base64:dGVzdA=='

      expect(MFID.canonical(id)).toBe(expected)
      expect(MFID.canonical(idString)).toBe(expected)
      expect(MFID.canonical(encoded)).toBe(expected)
      expect(MFID.canonical(expected)).toBe(expected)
    })
  })
})
