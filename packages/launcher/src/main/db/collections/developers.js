// @flow

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/developer'

export default async (params: CollectionParams) => {
  const db = params.db

  return await params.db.collection({
    name: COLLECTION_NAMES.DEVELOPERS,
    schema,
    methods: {
      async getApps(): Promise<Array<Object>> {
        return await db.apps.find({ developer: this.localID }).exec()
      },
    },
  })
}
