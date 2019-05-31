// @flow

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/appVersion'

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.APP_VERSIONS,
    schema,
    methods: {
      async getPublicID(): Promise<string> {
        const app = await this.populate('app')
        return app.getPublicID()
      },

      async getUpdate(): Promise<Object | null> {
        const app = await this.populate('app')
        return app.latestAvailableVersion == null ||
          app.latestAvailableVersion === this.manifest.version
          ? null
          : app.populate('latestAvailableVersion')
      },
    },
  })
}
