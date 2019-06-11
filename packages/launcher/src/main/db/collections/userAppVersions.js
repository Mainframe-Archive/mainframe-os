// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import schema, { type UserAppVersionData } from '../schemas/userAppVersion'

import type { AppVersionDoc } from './appVersions'
import type { UserAppSettingsDoc } from './userAppSettings'
import type { UserDoc } from './users'

type UserAppVersionPopulate = Populate<{
  appVersion: AppVersionDoc,
  user: UserDoc,
  userAppSettings: UserAppSettingsDoc,
}>

export type UserAppVersionDoc = UserAppVersionData & UserAppVersionPopulate

export type UserAppVersionsCollection = Collection<UserAppVersionData>

export default async (
  params: CollectionParams,
): Promise<UserAppVersionsCollection> => {
  return await params.db.collection({
    name: COLLECTION_NAMES.USER_APP_VERSIONS,
    schema,
    statics: {},
    methods: {},
  })
}
