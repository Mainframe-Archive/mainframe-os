// @flow

import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'

export type ManifestData = {
  id: string,
  author: {
    id: string,
  },
  name: string,
  version: string,
  contentsURI: string,
  permissions: StrictPermissionsRequirements,
}

export type PartialManifestData = {
  id: string,
  author: {
    id: string,
  },
  name: string,
  version: string,
  contentsURI: ?string,
  permissions: ?StrictPermissionsRequirements,
}

export type ManifestValidationResult = true | Array<Object>
