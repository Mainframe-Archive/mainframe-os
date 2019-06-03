// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import schema, { type AppVersionData } from '../schemas/appVersion'

export type AppVersionDoc = AppVersionData & {
  getPublicID(): Promise<string>,
  getUpdate(): Promise<AppVersionDoc | null>,
}

export type AppVersionsCollection = Collection<AppVersionDoc, AppVersionData>

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.APP_VERSIONS,
    schema,
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
