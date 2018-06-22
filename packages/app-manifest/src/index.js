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
import semver from 'semver'

import type {
  ManifestData,
  ManifestValidationError,
  ManifestValidationResult,
} from './types'

export * from './types'

export class ManifestError extends ExtendableError {
  reason: ManifestValidationError

  constructor(reason: ManifestValidationError, message?: string) {
    super(message || `Manifest error: ${reason}`)
    this.reason = reason
  }
}

export const validateManifest = (
  manifest: ManifestData,
  gtVersion?: string,
): ManifestValidationResult => {
  if (typeof manifest !== 'object') {
    return 'invalid_input'
  }

  if (typeof manifest.id !== 'string' || manifest.id.length === 0) {
    return 'invalid_id'
  }

  if (
    typeof manifest.author !== 'object' ||
    typeof manifest.author.id !== 'string' ||
    manifest.author.id.length === 0
  ) {
    return 'invalid_author'
  }

  if (typeof manifest.name !== 'string' || manifest.name.length === 0) {
    return 'invalid_name'
  }

  if (semver.valid(manifest.version) == null) {
    return 'invalid_version'
  }
  if (gtVersion != null && semver.gte(gtVersion, manifest.version)) {
    return 'invalid_min_version'
  }

  if (
    typeof manifest.contentsHash !== 'string' ||
    manifest.contentsHash.length === 0
  ) {
    return 'invalid_hash'
  }

  if (
    typeof manifest.permissions !== 'object' ||
    typeof manifest.permissions.required !== 'object' ||
    typeof manifest.permissions.optional !== 'object'
  ) {
    return 'invalid_permissions'
  }

  return 'valid'
}

export const parseManifestData = (input: ?Buffer): ManifestData => {
  if (input == null) {
    throw new ManifestError('invalid_signature')
  }

  let data
  try {
    data = JSON.parse(input.toString())
  } catch (err) {
    throw new ManifestError('invalid_input', err.message)
  }

  const result = validateManifest(data)
  if (result === 'valid') {
    return data
  } else {
    throw new ManifestError(result)
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
  if (result !== 'valid') {
    throw new ManifestError(result)
  }
  await writeSignedFile(path, Buffer.from(JSON.stringify(data)), keyPairs)
}
