// @flow

import { MF_PREFIX } from '../../../constants'

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/peer'

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.PEERS,
    schema,
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.CONTACT)
      },
    },
  })
}
