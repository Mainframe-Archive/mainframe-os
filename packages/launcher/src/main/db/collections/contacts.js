// @flow

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/contact'

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.CONTACTS,
    schema,
  })
}
