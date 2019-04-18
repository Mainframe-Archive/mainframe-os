// @flow

import permissionsRequirements from './appPermissionsRequirements'

export default {
  title: 'application manifest',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      final: true,
    },
    author: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          final: true,
        },
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
    contentsHash: {
      type: 'string',
    },
    updateHash: {
      type: 'string',
      final: true,
    },
    permissions: permissionsRequirements,
  },
  required: ['author', 'name', 'version', 'permissions'],
}
