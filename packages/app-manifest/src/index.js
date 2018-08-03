// @flow

import {
  readSignedFile,
  verifyContents,
  writeSignedFile,
  type SecureFile, // eslint-disable-line import/named
  type SignedContents, // eslint-disable-line import/named
} from '@mainframe/secure-file'
import type { KeyPair } from '@mainframe/utils-crypto'
import ExtendableError from 'es6-error'
import Validator from 'fastest-validator'
import multibase from 'multibase'
import multicodec from 'multicodec'

import { MANIFEST_SCHEMA, MANIFEST_SCHEMA_MESSAGES } from './schema'
import type {
  ManifestID,
  ManifestData,
  ManifestValidationResult,
} from './types'

export { parse as parseContentsURI } from 'uri-js'

export * from './schema'
export * from './types'

export const manifestIDType = (value: any): ManifestID => (value: ManifestID)

export const encodeID = (key: Buffer): ManifestID => {
  const prefixed = multicodec.addPrefix('ed25519-pub', key)
  return multibase.encode('base64url', prefixed).toString()
}

export class ManifestError extends ExtendableError {
  errors: ?Array<Object>

  constructor(message: string, errors?: ?Array<Object>) {
    super(message)
    this.errors = errors
  }
}

const v = new Validator({ messages: MANIFEST_SCHEMA_MESSAGES })
const check = v.compile(MANIFEST_SCHEMA)

export const validateManifest = (
  manifest: ManifestData,
): ManifestValidationResult => {
  return check(manifest)
}

export const parseManifestData = (input: ?Buffer): ManifestData => {
  if (input == null) {
    throw new ManifestError('Missing input')
  }

  let data
  try {
    data = JSON.parse(input.toString())
  } catch (err) {
    throw new ManifestError('Invalid JSON input')
  }

  const result = validateManifest(data)
  if (result === true) {
    return data
  } else {
    throw new ManifestError('Invalid manifest data', result)
  }
}

export const verifyManifest = (
  contents: SignedContents,
  keys?: Array<Buffer>,
): ManifestData => {
  return parseManifestData(verifyContents(contents, keys))
}

export const readManifestFile = async (
  path: string,
  keys?: Array<Buffer>,
): Promise<{ data: ManifestData, file: SecureFile<SignedContents> }> => {
  const file = await readSignedFile(path, keys)
  const data = parseManifestData(file.opened)
  // $FlowFixMe: SecureFile type
  return { data, file }
}

export const writeManifestFile = async (
  path: string,
  data: ManifestData,
  keyPairs: Array<KeyPair>,
): Promise<void> => {
  const result = validateManifest(data)
  if (result !== true) {
    throw new ManifestError('Invalid manifest data', result)
  }
  await writeSignedFile(path, Buffer.from(JSON.stringify(data)), keyPairs)
}
