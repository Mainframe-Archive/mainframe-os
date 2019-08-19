// @flow

import { COLLECTION_NAMES } from '../constants'

import ethAddress from './ethAddress'

export type AppData = {|
  localID: string,
  publicFeed: string,
  developer: string,
  latestAvailableVersion: ?string,
  latestDownloadedVersion: ?string,
|}

export default {
  title: 'app',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    publicFeed: {
      ...ethAddress,
      final: true,
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
