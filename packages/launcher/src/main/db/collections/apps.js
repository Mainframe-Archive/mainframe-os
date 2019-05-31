// @flow

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import { MF_PREFIX } from '../../../constants'

import schema from '../schemas/app'

export default async (params: CollectionParams) => {
  const db = params.db

  return await db.collection({
    name: COLLECTION_NAMES.APPS,
    schema,
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.APP)
      },

      async getVersions() {
        return await db.app_versions.find({ app: this.localID }).exec()
      },
    },
  })
}
