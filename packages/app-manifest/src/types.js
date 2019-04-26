// @flow

import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'

export type bzzHash = string

export type ManifestData = {
  id: string,
  author: {
    id: string,
    name: string,
  },
  name: string,
  version: string,
  contentsHash: bzzHash,
  updateHash: bzzHash,
  permissions: StrictPermissionsRequirements,
}

export type PartialManifestData = {
  id: string,
  author: {
    id: string,
    name: string,
  },
  name: string,
  version: string,
  contentsHash: ?bzzHash,
  updateHash: ?bzzHash,
  permissions: ?StrictPermissionsRequirements,
}

export type ManifestValidationResult = true | Array<Object>
