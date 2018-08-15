// @flow

import type { PermissionsRequirements } from '@mainframe/app-permissions'
import type { MainframeID } from '@mainframe/data-types'

export type ManifestData = {
  id: MainframeID,
  author: {
    id: MainframeID,
  },
  name: string,
  version: string,
  contentsURI: string,
  permissions: PermissionsRequirements,
}

export type PartialManifestData = {
  id: MainframeID,
  author: {
    id: MainframeID,
  },
  name: string,
  version: string,
  contentsURI: ?string,
  permissions: PermissionsRequirements,
}

export type ManifestValidationResult = true | Array<Object>
