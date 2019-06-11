// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import { MF_PREFIX } from '../../../constants'

import schema, { type AppData } from '../schemas/app'

import type { AppVersionDoc } from './appVersions'
import type { DeveloperDoc } from './developers'

type AppMethods = {
  getPublicID(): string,
  getVersions(): Promise<Array<AppVersionDoc>>,
}

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
    name: COLLECTION_NAMES.APPS,
    schema,
    statics: {},
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.APP)
      },

      async getVersions(): Promise<Array<AppVersionDoc>> {
        return await db.app_versions.find({ app: this.localID }).exec()
      },
    },
  })
}
