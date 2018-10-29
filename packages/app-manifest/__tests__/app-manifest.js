/* global getFixture, getTempFile */

import { encodeMainframeID } from '@mainframe/data-types'
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
    id: encodeMainframeID(Buffer.from('id')),
    author: {
      id: encodeMainframeID(Buffer.from('author')),
    },
    name: 'app',
    version: '0.2.0',
    contentsURI: 'urn:bzz:1234',
    permissions: {
      required: {},
      optional: {},
    },
  }

  it('ManifestError has an "errors" field', () => {
    const err = new ManifestError('Invalid test', [{ test: true }])
    expect(err.message).toBe('Invalid test')
    expect(err.errors).toEqual([{ test: true }])
  })

  it('validateManifest() returns a list of errors for missing fields', () => {
    expect(validateManifest({})).toEqual([
      {
        actual: undefined,
        expected: undefined,
        field: 'id',
        message: "The 'id' field is required!",
        type: 'required',
      },
      {
        actual: undefined,
        expected: undefined,
        field: 'author',
        message: "The 'author' field is required!",
        type: 'required',
      },
      {
        actual: undefined,
        expected: undefined,
        field: 'name',
        message: "The 'name' field is required!",
        type: 'required',
      },
      {
        actual: undefined,
        expected: undefined,
        field: 'version',
        message: "The 'version' field is required!",
        type: 'required',
      },
      {
        actual: undefined,
        expected: undefined,
        field: 'contentsURI',
        message: "The 'contentsURI' field is required!",
        type: 'required',
      },
      {
        actual: undefined,
        expected: undefined,
        field: 'permissions',
        message: "The 'permissions' field is required!",
        type: 'required',
      },
    ])
  })

  it('validateManifest() returns a list of errors for invalid fields', () => {
    expect(
      validateManifest({
        id: 'bad id',
        author: {
          id: 'bad id',
        },
        name: 'no',
        version: 2,
        contentsURI: 'urn:invalid',
        permissions: {
          required: {
            WEB_REQUEST: true,
          },
          optional: {},
        },
      }),
    ).toEqual([
      {
        actual: 'bad id',
        expected: null,
        field: 'id',
        message: "The value 'bad id' is not a valid Mainframe ID!",
        type: 'id',
      },
      {
        actual: 'bad id',
        expected: null,
        field: 'author.id',
        message: "The value 'bad id' is not a valid Mainframe ID!",
        type: 'id',
      },
      {
        actual: 2,
        expected: 3,
        field: 'name',
        message:
          "The 'name' field length must be larger than or equal to 3 characters long!",
        type: 'stringMin',
      },
      {
        actual: 2,
        expected: null,
        field: 'version',
        message: "The value '2' is not valid semver!",
        type: 'semver',
      },
      {
        actual: 'urn:invalid',
        expected: null,
        field: 'contentsURI',
        message: "The value 'urn:invalid' is not a valid URN!",
        type: 'urn',
      },
      {
        actual: undefined,
        expected: undefined,
        field: 'permissions.required.WEB_REQUEST',
        message:
          "The 'permissions.required.WEB_REQUEST' field must be an array!",
        type: 'array',
      },
    ])
  })

  it('validateManifest() returns true if the manifest is valid', () => {
    expect(validateManifest(validManifest)).toBe(true)
  })

  it('parseManifestData() throws an "Invalid input" ManifestError if the data is not provided', () => {
    try {
      parseManifestData()
    } catch (err) {
      expect(err instanceof ManifestError).toBe(true)
      expect(err.message).toBe('Missing input')
    }
  })

  it('parseManifestData() throws an "Invalid JSON data" ManifestError if the data cannot be parsed', () => {
    try {
      parseManifestData(Buffer.from('test'))
    } catch (err) {
      expect(err instanceof ManifestError).toBe(true)
      expect(err.message).toBe('Invalid JSON input')
    }
  })

  it('parseManifestData() throws a ManifestError with the validation result if the validation fails', () => {
    const data = Buffer.from(JSON.stringify({ id: 'test', author: {} }))
    try {
      parseManifestData(data)
    } catch (err) {
      expect(err instanceof ManifestError).toBe(true)
      expect(err.message).toBe('Invalid manifest data')
      expect(err.errors).toEqual([
        {
          actual: 'test',
          expected: null,
          field: 'id',
          message: "The value 'test' is not a valid Mainframe ID!",
          type: 'id',
        },
        {
          actual: undefined,
          expected: undefined,
          field: 'author.id',
          message: "The 'author.id' field is required!",
          type: 'required',
        },
        {
          actual: undefined,
          expected: undefined,
          field: 'name',
          message: "The 'name' field is required!",
          type: 'required',
        },
        {
          actual: undefined,
          expected: undefined,
          field: 'version',
          message: "The 'version' field is required!",
          type: 'required',
        },
        {
          actual: undefined,
          expected: undefined,
          field: 'contentsURI',
          message: "The 'contentsURI' field is required!",
          type: 'required',
        },
        {
          actual: undefined,
          expected: undefined,
          field: 'permissions',
          message: "The 'permissions' field is required!",
          type: 'required',
        },
      ])
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
      expect(err.message).toBe('Missing input')
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
    expect(read.keys).toHaveLength(2)
    expect(kp1.publicKey.equals(read.keys[0])).toBe(true)
    expect(kp2.publicKey.equals(read.keys[1])).toBe(true)
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
