// @flow

import type { PermissionsRequirements } from '@mainframe/app-permissions'

// base64url-encoded Ed25519 public key
export opaque type ManifestID: string = string

export type ManifestData = {
  id: ManifestID,
  author: {
    id: ManifestID,
  },
  name: string,
  version: string,
  contentsURI: string,
  permissions: PermissionsRequirements,
}

export type ManifestValidationResult = true | Array<Object>
