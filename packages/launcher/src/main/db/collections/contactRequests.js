// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'
import { generateLocalID } from '../utils'

import schema, { type ContactRequestData } from '../schemas/contactRequest'
import type { GenericProfile } from '../schemas/genericProfile'

export type ContactRequestDoc = ContactRequestData & {
  getPublicID(): Promise<string>,
  getProfile(): Promise<GenericProfile>,
}

export type ContactRequestsCollection = Collection<
  ContactRequestDoc,
  ContactRequestData,
> & {
  create(data: $Shape<ContactRequestData>): Promise<ContactRequestDoc>,
}

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.CONTACT_REQUESTS,
    schema,
    statics: {
      async create(data: Object = {}) {
        return await this.insert({
          ...data,
          localID: generateLocalID(),
        })
      },
    },
    methods: {
      async getPublicID(): Promise<string> {
        const peer = await this.populate('peer')
        return peer.getPublicID()
      },

      async getProfile(): Promise<GenericProfile> {
        const peer = await this.populate('peer')
        return peer.profile
      },
    },
  })
}
