// @flow

import { COLLECTION_NAMES } from '../constants'

import permissionsRequirements from './appPermissionsRequirements'
import bzzHash from './bzzHash'
import profile from './genericProfile'
import keyPair from './keyPair'

const appVersion = {
  title: 'own app version',
  version: 0,
  type: 'object',
  properties: {
    version: {
      type: 'string', // semver
    },
    contentsHash: bzzHash,
    versionHash: bzzHash, // chapter ID
    permissions: permissionsRequirements,
  },
  required: ['permissionsRequirements'],
}

export default {
  title: 'own app',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    developer: {
      type: 'string',
      ref: COLLECTION_NAMES.OWN_DEVELOPERS,
      index: true,
    },
    keyPair,
    profile,
    contentsPath: {
      type: 'string',
    },
    versions: {
      type: 'array',
      items: appVersion,
      default: [],
    },
  },
  required: ['contentsPath', 'developer', 'keyPair', 'profile'],
}
