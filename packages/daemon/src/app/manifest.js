// @flow

import type { PermissionsRequirements } from '@mainframe/app-permissions'
// eslint-disable-next-line import/named
import { decodeBase64, type base64 } from '@mainframe/utils-base64'
import semver from 'semver'

export type AppManifest = {
  id: base64,
  author: {
    id: base64,
  },
  name: string,
  version: string,
  permissions: PermissionsRequirements,
}

export type ManifestValidationResult =
  | 'invalid_input'
  | 'invalid_id'
  | 'invalid_author'
  | 'invalid_name'
  | 'invalid_version'
  | 'invalid_min_version'
  | 'invalid_permissions'
  | 'valid'

export const validateManifest = (
  manifest: AppManifest,
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
  if (gtVersion != null && !semver.gt(gtVersion, manifest.version)) {
    return 'invalid_min_version'
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
