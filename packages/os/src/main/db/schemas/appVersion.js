// @flow

import { COLLECTION_NAMES } from '../constants'

import manifest, { type AppManifestData } from './appManifest'

export type AppInstallationState = 'pending' | 'downloading' | 'failed' | 'done'

export type AppVersionData = {|
  localID: string,
  app: string,
  developer: string,
  manifest: AppManifestData,
  installationState: AppInstallationState,
|}

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
      index: true,
    },
    developer: {
      type: 'string',
      ref: COLLECTION_NAMES.DEVELOPERS,
      index: true,
    },
    manifest,
    installationState: {
      type: 'string',
      enum: ['pending', 'downloading', 'failed', 'done'],
      default: 'pending',
    },
  },
  required: ['app', 'developer', 'manifest'],
}
