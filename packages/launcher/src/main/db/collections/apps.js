// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import { MF_PREFIX } from '../../../constants'

import schema, { type AppData } from '../schemas/app'

import type { AppVersionDoc } from './appVersions'

export type AppDoc = AppData & {
  getPublicID(): string,
  getVersions(): Promise<Array<AppVersionDoc>>,
}

export type AppsCollection = Collection<AppDoc, AppData>

export default async (params: CollectionParams) => {
  const db = params.db

  return await db.collection({
    name: COLLECTION_NAMES.APPS,
    schema,
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.APP)
      },

      async getVersions(): Promise<AppVersionDoc> {
        return await db.app_versions.find({ app: this.localID }).exec()
      },
    },
  })
}
