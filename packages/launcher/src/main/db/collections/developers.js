// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import schema, { type DeveloperData } from '../schemas/developer'

import type { AppDoc } from './apps'

type DeveloperMethods = {|
  getApps(): Promise<Array<AppDoc>>,
|}

export type DeveloperDoc = DeveloperData & DeveloperMethods

export type DevelopersCollection = Collection<DeveloperData, DeveloperDoc>

export default async (
  params: CollectionParams,
): Promise<DevelopersCollection> => {
  const db = params.db

  return await params.db.collection<
    DeveloperData,
    DeveloperDoc,
    DeveloperMethods,
    {},
  >({
    name: COLLECTION_NAMES.DEVELOPERS,
    schema,
    statics: {},
    methods: {
      async getApps(): Promise<Array<AppDoc>> {
        return await db.apps.find({ developer: this.localID }).exec()
      },
    },
  })
}
