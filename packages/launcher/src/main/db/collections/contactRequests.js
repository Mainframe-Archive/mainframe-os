// @flow

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/contactRequest'

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.CONTACT_REQUESTS,
    schema,
  })
}
