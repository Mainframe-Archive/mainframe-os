// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import schema, { type DeveloperData } from '../schemas/developer'
import { generateLocalID } from '../utils'

import type { AppDoc } from './apps'

type DeveloperMethods = {|
  getApps(): Promise<Array<AppDoc>>,
|}

export type DeveloperDoc = DeveloperData & DeveloperMethods

type DeveloperStatics = {|
  getOrCreateByAddress(address: string): Promise<DeveloperDoc>,
|}

export type DevelopersCollection = Collection<DeveloperData, DeveloperDoc> &
  DeveloperStatics

// TODO: handle sync from Swarm

export default async (
  params: CollectionParams,
): Promise<DevelopersCollection> => {
  const db = params.db

  return await params.db.collection<
    DeveloperData,
    DeveloperDoc,
    DeveloperMethods,
    DeveloperStatics,
  >({
    name: COLLECTION_NAMES.DEVELOPERS,
    schema,
    statics: {
      async getOrCreateByAddress(address: string): Promise<DeveloperDoc> {
        const existing = await this.findOne({ publicFeed: address }).exec()
        if (existing != null) {
          return existing
        }

        return await this.insert({
          localID: generateLocalID(),
          publicFeed: address,
        })
      },
    },
    methods: {
      async getApps(): Promise<Array<AppDoc>> {
        return await db.apps.find({ developer: this.localID }).exec()
      },
    },
  })
}
