import { signContents } from '@mainframe/secure-file'
import { createSignKeyPair } from '@mainframe/utils-crypto'

import {
  ManifestError,
  validateManifest,
  parseManifestData,
  verifyManifest,
  readManifestFile,
  writeManifestFile,
} from '..'

describe('app-manifest', () => {
  const validManifest = {
    id: 'test',
    author: { id: 'author' },
    name: 'app',
    version: '0.2.0',
    contentsHash: '1234abcd',
    permissions: {
      required: {},
      optional: {},
    },
  }

  it('ManifestError has a "reason" field', () => {
    const err = new ManifestError('invalid_test', 'Error message')
    expect(err.message).toBe('Error message')
    expect(err.reason).toBe('invalid_test')
  })

  it('ManifestError defaults its "message"', () => {
    const err = new ManifestError('invalid_test')
    expect(err.message).toBe('Manifest error: invalid_test')
  })

  it('validateManifest() returns "invalid_input" if the manifest is not an object', () => {
    expect(validateManifest('test')).toBe('invalid_input')
  })

  it('validateManifest() returns "invalid_id" if the "id" is not a string or an empty one', () => {
    expect(validateManifest({ id: 1 })).toBe('invalid_id')
    expect(validateManifest({ id: '' })).toBe('invalid_id')
  })

  it('validateManifest() returns "invalid_author" if the "author" field is not an object with a valid "id"', () => {
    expect(
      validateManifest({
        id: 'test',
        author: 1,
      }),
    ).toBe('invalid_author')
    expect(
      validateManifest({
        id: 'test',
        author: { id: 1 },
      }),
    ).toBe('invalid_author')
    expect(
      validateManifest({
        id: 'test',
        author: { id: '' },
      }),
    ).toBe('invalid_author')
  })

  it('validateManifest() returns "invalid_name" if the "name" is not a valid string', () => {
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: [],
      }),
    ).toBe('invalid_name')
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: '',
      }),
    ).toBe('invalid_name')
  })

  it('validateManifest() returns "invalid_version" if the "version" is not a valid semver string', () => {
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: 'app',
        version: 'not semver',
      }),
    ).toBe('invalid_version')
  })

  it('validateManifest() returns "invalid_min_version" if the "version" is not higher than the provided value', () => {
    expect(
      validateManifest(
        {
          id: 'test',
          author: { id: 'author' },
          name: 'app',
          version: '0.2.0',
        },
        '0.3.1',
      ),
    ).toBe('invalid_min_version')
  })

  it('validateManifest() returns "invalid_hash" if the "contentsHash" is not valid', () => {
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: 'app',
        version: '0.2.0',
      }),
    ).toBe('invalid_hash')
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: 'app',
        version: '0.2.0',
        contentsHash: '',
      }),
    ).toBe('invalid_hash')
  })

  it('validateManifest() returns "invalid_permissions" if the "permissions" object is not properly set', () => {
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: 'app',
        version: '0.2.0',
        contentsHash: '1234',
        permissions: true,
      }),
    ).toBe('invalid_permissions')
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: 'app',
        version: '0.2.0',
        contentsHash: '1234',
        permissions: {},
      }),
    ).toBe('invalid_permissions')
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: 'app',
        version: '0.2.0',
        contentsHash: '1234',
        permissions: {
          required: true,
        },
      }),
    ).toBe('invalid_permissions')
    expect(
      validateManifest({
        id: 'test',
        author: { id: 'author' },
        name: 'app',
        version: '0.2.0',
        contentsHash: '1234',
        permissions: {
          required: {},
          optional: false,
        },
      }),
    ).toBe('invalid_permissions')
    expect(validateManifest(validManifest)).toBe('valid')
  })

  it('validateManifest() returns "valid" if the expected fields are provided', () => {
    expect(
      validateManifest(
        {
          id: 'test',
          author: { id: 'author' },
          name: 'app',
          version: '0.4.0',
          contentsHash: '1234',
          permissions: {
            required: {},
            optional: {},
          },
        },
        '0.3.1',
      ),
    ).toBe('valid')
  })

  it('parseManifestData() throws an "invalid_signature" ManifestError if the data is not provided', () => {
    expect(() => parseManifestData()).toThrow(
      'Manifest error: invalid_signature',
    )
  })

  it('parseManifestData() throws an "invalid_input" ManifestError if the data cannot be parsed', () => {
    try {
      parseManifestData(Buffer.from('test'))
    } catch (err) {
      expect(err instanceof ManifestError).toBe(true)
      expect(err.message).toBe('Unexpected token e in JSON at position 1')
      expect(err.reason).toBe('invalid_input')
    }
  })

  it('parseManifestData() throws a ManifestError with the validation result if the validation fails', () => {
    const data = Buffer.from(JSON.stringify({ id: 'test', author: {} }))
    try {
      parseManifestData(data)
    } catch (err) {
      expect(err instanceof ManifestError).toBe(true)
      expect(err.reason).toBe('invalid_author')
    }
  })

  it('parseManifestData() returns the manifest data when valid', () => {
    const data = Buffer.from(JSON.stringify(validManifest))
    expect(parseManifestData(data)).toEqual(validManifest)
  })

  it('verifyManifest() validates the manifest contents', () => {
    const kp1 = createSignKeyPair()
    const kp2 = createSignKeyPair()
    const contents = signContents(Buffer.from('test'), [kp1, kp2])
    expect(() => verifyManifest(contents)).toThrow(ManifestError)
  })

  it('verifyManifest() can be provided the signing keys', () => {
    const kp1 = createSignKeyPair()
    const kp2 = createSignKeyPair()
    const contents = signContents(Buffer.from('test'), [kp1, kp2])
    try {
      verifyManifest(contents, [kp1.publicKey])
    } catch (err) {
      expect(err instanceof ManifestError).toBe(true)
      expect(err.reason).toBe('invalid_signature')
    }
  })

  it('verifyManifest() returns the manifest data when valid', () => {
    const kp1 = createSignKeyPair()
    const kp2 = createSignKeyPair()
    const data = Buffer.from(JSON.stringify(validManifest))
    const contents = signContents(data, [kp1, kp2])
    const manifest = verifyManifest(contents, [kp1.publicKey, kp2.publicKey])
    expect(manifest).toEqual(validManifest)
  })

  it('has writeSignedFile() and readSignedFile() functions', async () => {
    const path = getTempFile('signed.json')
    const kp1 = createSignKeyPair()
    const kp2 = createSignKeyPair()
    await writeManifestFile(path, validManifest, [kp1, kp2])
    const read = await readManifestFile(path)
    expect(read.data).toEqual(validManifest)
    expect(read.file).toEqual(expect.any(Object))
  })

  it('writeSignedFile() throws an error if the manifest is not valid', () => {
    const path = getFixture(__dirname, 'invalid-manifest.json')
    const kp1 = createSignKeyPair()
    const kp2 = createSignKeyPair()
    const data = { id: 'test', author: {} }
    expect(writeManifestFile(path, data, [kp1, kp2])).rejects.toThrow(
      ManifestError,
    )
  })
})
