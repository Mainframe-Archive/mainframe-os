// @flow

import uuidv4 from 'uuid/v4'
import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import { MF_PREFIX } from '../../../constants'
import schema, { type WyreDeviceToken } from '../schemas/wyreDeviceToken'

import type { AppVersionDoc } from './appVersions'
import type { DeveloperDoc } from './developers'

type AppMethods = {|
  getToken(): string,
|}

export type AppDoc = AppData &
  AppMethods &
  Populate<{
    developer: DeveloperDoc,
    latestAvailableVersion: ?AppVersionDoc,
    latestDownloadedVersion: ?AppVersionDoc,
  }>

export type AppsCollection = Collection<AppData, AppDoc>

export default async (params: CollectionParams): Promise<AppsCollection> => {
  const db = params.db

  return await db.collection<AppData, AppDoc, AppMethods, {}>({
    name: COLLECTION_NAMES.WYRE_DEVICE_TOKEN,
    schema,
    statics: {},
    methods: {
      getToken(): string {
        console.log('DB WYRE DEV TOKEN')
        if (this._deviceToken == null) {
          this._deviceToken = uuidv4()
        }
        console.log(this._deviceToken)

        return this._deviceToken
      },
    },
  })
}
