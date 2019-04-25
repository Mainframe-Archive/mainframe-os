// @flow

import { COLLECTION_NAMES } from '../constants'

import permissionsRequirements from './appPermissionsRequirements'
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
    contentsHash: {
      type: 'string',
    },
    versionHash: {
      type: 'string',
    },
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
    updateFeed: ownFeed,
    version: {
      type: 'string',
    },
    versions: {
      type: 'array',
      items: appVersion,
    },
  },
  required: ['keyPair', 'name', 'version'],
}
