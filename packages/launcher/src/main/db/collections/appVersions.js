// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import schema, { type AppVersionData } from '../schemas/appVersion'

import type { AppDoc } from './apps'
import type { DeveloperDoc } from './developers'

type AppVersionMethods = {|
  getPublicID(): Promise<string>,
  getUpdate(): Promise<AppVersionDoc | null>, // eslint-disable-line no-use-before-define
|}

export type AppVersionDoc = AppVersionData &
  AppVersionMethods &
  Populate<{
    app: AppDoc,
    developer: DeveloperDoc,
  }>

export type AppVersionsCollection = Collection<AppVersionData, AppVersionDoc>

export default async (
  params: CollectionParams,
): Promise<AppVersionsCollection> => {
  return await params.db.collection<
    AppVersionData,
    AppVersionDoc,
    AppVersionMethods,
    {},
  >({
    name: COLLECTION_NAMES.APP_VERSIONS,
    schema,
    statics: {},
    methods: {
      async getPublicID(): Promise<string> {
        const app = await this.populate('app')
        return app.getPublicID()
      },

      async getUpdate(): Promise<AppVersionDoc | null> {
        const app = await this.populate('app')
        return app.latestAvailableVersion == null ||
          app.latestAvailableVersion === this.manifest.version
          ? null
          : app.populate('latestAvailableVersion')
      },
    },
  })
}
