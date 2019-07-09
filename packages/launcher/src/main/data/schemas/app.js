// @flow

import { APP_MANIFEST_V0 } from '../constants'

import { profileProperty } from './profile'
import { ethereumAddressProperty, swarmHashProperty } from './scalars'

const appPermissionsDefinitionsProperty = {
  type: 'object',
  properties: {
    CONTACT_COMMUNICATION: {
      type: 'boolean',
    },
    CONTACT_LIST: {
      type: 'boolean',
    },
    ETHEREUM_TRANSACTION: {
      type: 'boolean',
    },
    WEB_REQUEST: {
      type: 'array',
      items: {
        type: 'string', // URL
      },
    },
  },
}

export const appPermissionsRequirementsProperty = {
  type: 'object',
  properties: {
    required: appPermissionsDefinitionsProperty,
    optional: appPermissionsDefinitionsProperty,
  },
}

export const appManifestSchema = {
  $async: true,
  $id: APP_MANIFEST_V0,
  type: 'object',
  required: [
    'authorAddress',
    'profile',
    'version',
    'contentsHash',
    'permissions',
  ],
  properties: {
    authorAddress: ethereumAddressProperty,
    profile: profileProperty,
    version: {
      type: 'string',
      maxLength: 20,
    },
    contentsHash: swarmHashProperty,
    permissions: appPermissionsRequirementsProperty,
  },
}
