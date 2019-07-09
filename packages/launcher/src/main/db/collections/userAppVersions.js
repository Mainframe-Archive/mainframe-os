// @flow

import type { AppData } from '../../../types'

import type { Environment } from '../../environment'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import schema, { type UserAppVersionData } from '../schemas/userAppVersion'

import type { AppDoc } from './apps'
import type { AppVersionDoc } from './appVersions'
import type { UserAppSettingsDoc } from './userAppSettings'
import type { UserDoc } from './users'

type UserAppVersionMethods = {|
  getPublicID(): Promise<string>,
  getAppData(env: Environment): Promise<AppData>,
|}

type UserAppVersionPopulate = Populate<{
  app: AppDoc,
  appVersion: AppVersionDoc,
  settings: UserAppSettingsDoc,
  user: UserDoc,
}>

export type UserAppVersionDoc = UserAppVersionData &
  UserAppVersionMethods &
  UserAppVersionPopulate

type UserAppVersionStatics = {|
  findByAppAndUserID(
    appID: string,
    userID: string,
  ): Promise<UserAppVersionDoc | null>,
|}

export type UserAppVersionsCollection = Collection<UserAppVersionData> &
  UserAppVersionStatics

export default async (
  params: CollectionParams,
): Promise<UserAppVersionsCollection> => {
  const { db } = params

  return await db.collection<
    UserAppVersionData,
    UserAppVersionDoc,
    UserAppVersionMethods,
    UserAppVersionStatics,
  >({
    name: COLLECTION_NAMES.USER_APP_VERSIONS,
    schema,
    statics: {
      async findByAppAndUserID(
        appID: string,
        userID: string,
      ): Promise<UserAppVersionDoc | null> {
        return await this.findOne({ app: appID, user: userID }).exec()
      },
    },
    methods: {
      async getPublicID(): Promise<string> {
        const app = await this.populate('app')
        return app.getPublicID()
      },

      async getAppData(env: Environment): Promise<AppData> {
        const appVersion = await this.populate('appVersion')
        const app = await this.populate('app')
        return {
          contentsPath: env.getAppContentsPath(
            app.getPublicID(),
            appVersion.manifest.version,
          ),
          profile: app.profile,
          publicID: app.getPublicID(),
        }
      },
    },
  })
}
