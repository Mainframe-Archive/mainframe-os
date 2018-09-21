// @flow

import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'
import type { MainframeID } from '@mainframe/data-types'

export type ManifestData = {
  id: MainframeID,
  author: {
    id: MainframeID,
  },
  name: string,
  version: string,
  contentsURI: string,
  permissions: StrictPermissionsRequirements,
}

export type PartialManifestData = {
  id: MainframeID,
  author: {
    id: MainframeID,
  },
  name: string,
  version: string,
  contentsURI: ?string,
  permissions: ?StrictPermissionsRequirements,
}

export type ManifestValidationResult = true | Array<Object>
