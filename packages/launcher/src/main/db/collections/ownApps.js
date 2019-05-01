// @flow

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/ownApp'

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.OWN_APPS,
    schema,
  })
}
