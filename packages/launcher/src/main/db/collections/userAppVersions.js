// @flow

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/userAppVersion'

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.USER_APP_VERSIONS,
    schema,
  })
}
