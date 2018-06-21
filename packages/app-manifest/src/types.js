// @flow

import type { PermissionsRequirements } from '@mainframe/app-permissions'
import type { base64 } from '@mainframe/utils-base64'

export type ManifestData = {
  id: base64,
  author: {
    id: base64,
  },
  name: string,
  version: string,
  contentsHash: string,
  permissions: PermissionsRequirements,
}

export type ManifestValidationError =
  | 'invalid_signature'
  | 'invalid_input'
  | 'invalid_id'
  | 'invalid_author'
  | 'invalid_name'
  | 'invalid_version'
  | 'invalid_min_version'
  | 'invalid_hash'
  | 'invalid_permissions'

export type ManifestValidationResult = ManifestValidationError | 'valid'
