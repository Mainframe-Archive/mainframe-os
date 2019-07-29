// @flow

import { pubKeyToAddress } from '@erebos/keccak256'

import { MF_PREFIX } from '../../../constants'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'

import schema, { type DeveloperData } from '../schemas/developer'
import { generateLocalID } from '../utils'

import type { AppDoc } from './apps'

type DeveloperMethods = {|
  getPublicID(): string,
  getApps(): Promise<Array<AppDoc>>,
|}

export type DeveloperDoc = Doc<DeveloperData, DeveloperMethods>

type DeveloperStatics = {|
  getOrCreateByPublicKey(publicKey: string): Promise<DeveloperDoc>,
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
      async getOrCreateByPublicKey(publicKey: string): Promise<DeveloperDoc> {
        const existing = await this.findOne({ publicKey }).exec()
        if (existing != null) {
          return existing
        }

        return await this.insert({
          localID: generateLocalID(),
          publicFeed: pubKeyToAddress(Buffer.from(publicKey, 'hex')),
          publicKey,
        })
      },
    },
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.DEVELOPER)
      },

      async getApps(): Promise<Array<AppDoc>> {
        return await db.apps.find({ developer: this.localID }).exec()
      },
    },
  })
}
