// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import schema, { type UserAppSettingsData } from '../schemas/userAppSettings'

export type UserAppSettingsDoc = UserAppSettingsData
export type UserAppSettingsCollection = Collection<UserAppSettingsData>

export default async (
  params: CollectionParams,
): Promise<UserAppSettingsCollection> => {
  return await params.db.collection({
    name: COLLECTION_NAMES.USER_APP_SETTINGS,
    schema,
    statics: {},
    methods: {},
  })
}
