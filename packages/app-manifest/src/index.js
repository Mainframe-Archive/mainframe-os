// @flow

import {
  readSignedFile,
  signContents,
  verifyContents,
  writeSignedFile,
  type SignedContents, // eslint-disable-line import/named
} from '@mainframe/secure-file'
import { decodeBase64 } from '@mainframe/utils-base64'
import type { KeyPair } from '@mainframe/utils-crypto'
import ExtendableError from 'es6-error'
import Validator from 'fastest-validator'

import { MANIFEST_SCHEMA_MESSAGES, MANIFEST_SCHEMA_PROPS } from './schema'
import type { ManifestData, ManifestValidationResult } from './types'

export * from './schema'
export * from './types'

export class ManifestError extends ExtendableError {
  errors: ?Array<Object>

  constructor(message: string, errors?: ?Array<Object>) {
    super(message)
    this.errors = errors
  }
}

const v = new Validator({ messages: MANIFEST_SCHEMA_MESSAGES })
const check = v.compile(MANIFEST_SCHEMA_PROPS)

export const validateManifest = (
  manifest: ManifestData,
): ManifestValidationResult => {
  return check(manifest)
}

export const encodeManifest = (data: ManifestData): Buffer => {
  const result = validateManifest(data)
  if (result === true) {
    return Buffer.from(JSON.stringify(data))
  }
  throw new ManifestError('Invalid manifest data', result)
}

export const createSignedManifest = (
  data: ManifestData,
  keyPairs: Array<KeyPair>,
): SignedContents => {
  return signContents(encodeManifest(data), keyPairs)
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
  useKeys?: Array<Buffer>,
): ManifestData => {
  return parseManifestData(verifyContents(contents, useKeys))
}

export const readManifestFile = async (
  path: string,
  useKeys?: Array<Buffer>,
): Promise<{ data: ManifestData, keys: Array<Buffer> }> => {
  const { file, opened } = await readSignedFile(path, useKeys)
  const keys = useKeys || file.contents.signed.keys.map(decodeBase64)
  return {
    data: parseManifestData(opened),
    keys,
  }
}

export const writeManifestFile = async (
  path: string,
  data: ManifestData,
  keyPairs: Array<KeyPair>,
): Promise<void> => {
  await writeSignedFile(path, encodeManifest(data), keyPairs)
}
