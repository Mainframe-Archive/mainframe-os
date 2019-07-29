// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'
import { generateLocalID } from '../utils'

import schema, { type ContactRequestData } from '../schemas/contactRequest'
import type { GenericProfile } from '../schemas/genericProfile'

import type { PeerDoc } from './peers'

type ContactRequestMethods = {|
  getPublicID(): Promise<string>,
  getProfile(): Promise<GenericProfile>,
|}

export type ContactRequestDoc = Doc<
  ContactRequestData,
  ContactRequestMethods,
  { peer: PeerDoc },
>

type ContactRequestsStatics = {|
  create(data: $Shape<ContactRequestData>): Promise<ContactRequestDoc>,
|}

export type ContactRequestsCollection = Collection<
  ContactRequestData,
  ContactRequestDoc,
> &
  ContactRequestsStatics

export default async (
  params: CollectionParams,
): Promise<ContactRequestsCollection> => {
  return await params.db.collection({
    name: COLLECTION_NAMES.CONTACT_REQUESTS,
    schema,
    statics: {
      async create(
        data: $Shape<ContactRequestData> = {},
      ): Promise<ContactRequestDoc> {
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
