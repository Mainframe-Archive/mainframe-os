// @flow

import type { RxDatabase } from 'rxdb'

import { COLLECTION_NAMES } from '../constants'

import schema from '../schemas/ownApp'

export default async (db: RxDatabase) => {
  return await db.collection({
    name: COLLECTION_NAMES.OWN_APPS,
    schema,
  })
}
