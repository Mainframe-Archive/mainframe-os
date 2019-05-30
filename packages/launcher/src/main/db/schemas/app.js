// @flow

import { COLLECTION_NAMES } from '../constants'

export default {
  title: 'app',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    developer: {
      type: 'string',
      ref: COLLECTION_NAMES.DEVELOPERS,
      index: true,
    },
    latestAvailableVersion: {
      type: 'string',
      ref: COLLECTION_NAMES.APP_VERSIONS,
    },
    latestDownloadedVersion: {
      type: 'string',
      ref: COLLECTION_NAMES.APP_VERSIONS,
    },
  },
}
