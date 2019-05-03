// @flow

import { COLLECTION_NAMES } from '../constants'

import permissionsRequirements from './appPermissionsRequirements'
import bzzHash from './bzzHash'
import keyPair from './keyPair'
import ownFeed from './ownFeed'

const appVersion = {
  title: 'own app version',
  version: 0,
  type: 'object',
  properties: {
    version: {
      type: 'string', // semver
    },
    contentsHash: bzzHash,
    versionHash: bzzHash,
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
    keyPair,
    mfid: {
      type: 'string',
      final: true,
      index: true,
    },
    developer: {
      type: 'string',
      ref: COLLECTION_NAMES.OWN_DEVELOPERS,
    },
    name: {
      type: 'string',
    },
    feed: ownFeed,
    version: {
      type: 'string',
    },
    versions: {
      type: 'array',
      items: appVersion,
      default: [],
    },
  },
  required: ['keyPair', 'name', 'version'],
}
