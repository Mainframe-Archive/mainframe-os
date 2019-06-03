// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import schema, { type DeveloperData } from '../schemas/developer'

import type { AppDoc } from './apps'

export type DeveloperDoc = DeveloperData & {
  getApps(): Promise<Array<AppDoc>>,
}

export type DevelopersCollection = Collection<DeveloperDoc, DeveloperData>

export default async (params: CollectionParams) => {
  const db = params.db

  return await params.db.collection({
    name: COLLECTION_NAMES.DEVELOPERS,
    schema,
    methods: {
      async getApps(): Promise<Array<AppDoc>> {
        return await db.apps.find({ developer: this.localID }).exec()
      },
    },
  })
}
