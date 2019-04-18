// @flow

import { COLLECTION_NAMES } from '../constants'

import manifest from './appManifest'

export default {
  title: 'app version',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    app: {
      type: 'string',
      ref: COLLECTION_NAMES.APPS,
    },
    manifest,
    installationState: {
      type: 'string',
      enum: ['pending', 'downloading', 'failed', 'done'],
      default: 'pending',
    },
  },
}
