// @flow

import { COLLECTION_NAMES } from '../constants'

export default {
  title: 'user own app',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    user: {
      type: 'string',
      ref: COLLECTION_NAMES.USERS,
      final: true,
    },
    ownApp: {
      type: 'string',
      ref: COLLECTION_NAMES.OWN_APPS,
    },
    settings: {
      type: 'string',
      ref: COLLECTION_NAMES.USER_APP_SETTINGS,
    },
  },
  compoundIndexes: [['user', 'ownApp']],
}
