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
  getApp(): Promise<AppDoc>,
  getPublicID(): Promise<string>,
  getAppData(env: Environment): Promise<AppData>,
|}

type UserAppVersionPopulate = Populate<{
  appVersion: AppVersionDoc,
  settings: UserAppSettingsDoc,
  user: UserDoc,
}>

export type UserAppVersionDoc = UserAppVersionData &
  UserAppVersionMethods &
  UserAppVersionPopulate

export type UserAppVersionsCollection = Collection<UserAppVersionData>

export default async (
  params: CollectionParams,
): Promise<UserAppVersionsCollection> => {
  return await params.db.collection<
    UserAppVersionData,
    UserAppVersionDoc,
    UserAppVersionMethods,
    {},
  >({
    name: COLLECTION_NAMES.USER_APP_VERSIONS,
    schema,
    statics: {},
    methods: {
      async getApp(): Promise<AppDoc> {
        const appVersion = await this.populate('appVersion')
        return await appVersion.populate('app')
      },

      async getPublicID(): Promise<string> {
        const app = await this.getApp()
        return app.getPublicID()
      },

      async getAppData(env: Environment): Promise<AppData> {
        const appVersion = await this.populate('appVersion')
        const app = await this.populate('ownApp')
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
