// @flow

import type { RxDatabase } from 'rxdb'

import { COLLECTION_NAMES } from '../constants'

import schema from '../schemas/appVersion'

export default async (db: RxDatabase) => {
  return await db.collection({
    name: COLLECTION_NAMES.APP_VERSIONS,
    schema,
  })
}
