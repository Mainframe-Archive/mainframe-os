// @flow

import permissionsRequirements from './appPermissionsRequirements'
import bzzHash from './bzzHash'

export default {
  title: 'application manifest',
  version: 0,
  type: 'object',
  properties: {
    // TODO: replace by "key" (MFID)
    id: {
      type: 'string',
      final: true,
    },
    author: {
      type: 'object',
      properties: {
        // TODO: replace by "key" (MFID)
        id: {
          type: 'string',
          final: true,
        },
        // TODO: replace by developer address (feed)
        name: {
          type: 'string',
          min: 3,
          max: 20,
        },
      },
    },
    name: {
      type: 'string',
    },
    version: {
      type: 'string', // semver
    },
    contentsHash: bzzHash,
    // TODO: replace by app address, or even remove?
    // Should it be "publicID"?
    updateHash: {
      ...bzzHash,
      final: true,
    },
    permissions: permissionsRequirements,
  },
  required: ['author', 'name', 'version', 'permissions'],
}
