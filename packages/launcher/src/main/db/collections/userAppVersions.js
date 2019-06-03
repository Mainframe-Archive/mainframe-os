// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import schema, { type UserAppVersionData } from '../schemas/userAppVersion'

export type UserAppVersionDoc = UserAppVersionData
export type UserAppVersionsCollection = Collection<
  UserAppVersionDoc,
  UserAppVersionData,
>

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.USER_APP_VERSIONS,
    schema,
  })
}
