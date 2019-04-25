// @flow

import { COLLECTION_NAMES } from '../constants'

import permissionsGrants from './appPermissionsGrants'
import bzzHash from './bzzHash'

// These settings should be shared by both own apps and installed ones

export default {
  title: 'user app settings',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    approvedContacts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          aliasID: {
            type: 'string',
            final: true,
          },
          contact: {
            type: 'string',
            ref: COLLECTION_NAMES.CONTACTS,
          },
        },
      },
    },
    defaultEthAccount: {
      type: 'string',
    },
    permissionsChecked: {
      type: 'boolean',
      default: false,
    },
    permissionsGrants,
    storageEncryptionKey: {
      type: 'string',
      final: true,
    },
    storageFeedHash: bzzHash,
    storageFeedKey: {
      type: 'string',
      final: true,
    },
  },
}
