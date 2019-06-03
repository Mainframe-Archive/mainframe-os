// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import schema, { type ContactRequestData } from '../schemas/contactRequest'

export type ContactRequestDoc = ContactRequestData & {
  getPublicID(): Promise<string>,
}

export type ContactRequestsCollection = Collection<
  ContactRequestDoc,
  ContactRequestData,
>

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.CONTACT_REQUESTS,
    schema,
    methods: {
      async getPublicID(): Promise<string> {
        const peer = await this.populate('peer')
        return peer.getPublicID()
      },
    },
  })
}
