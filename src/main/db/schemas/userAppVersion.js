// @flow

import { COLLECTION_NAMES } from '../constants'

export type UserAppVersionData = {|
  localID: string,
  user: string,
  app: string,
  appVersion: string,
  settings: string,
|}

export default {
  title: 'user app version',
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
    app: {
      type: 'string',
      ref: COLLECTION_NAMES.APPS,
      final: true,
    },
    appVersion: {
      type: 'string',
      ref: COLLECTION_NAMES.APP_VERSIONS,
      index: true,
    },
    settings: {
      type: 'string',
      ref: COLLECTION_NAMES.USER_APP_SETTINGS,
    },
  },
  compoundIndexes: [['user', 'app']],
}
