// @flow

import type { AppData } from '../../../types'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import schema, { type UserOwnAppData } from '../schemas/userOwnApp'
import { generateLocalID } from '../utils'

import type { OwnAppDoc } from './ownApps'
import type { UserAppSettingsDoc } from './userAppSettings'
import type { UserDoc } from './users'

type UserOwnAppMethods = {|
  getAppData(): Promise<AppData>,
|}

type UserOwnAppPopulate = Populate<{
  ownApp: OwnAppDoc,
  settings: UserAppSettingsDoc,
  user: UserDoc,
}>

export type UserOwnAppDoc = UserOwnAppData &
  UserOwnAppMethods &
  UserOwnAppPopulate

type UserOwnAppStatics = {|
  createFor(userID: string, ownApp: OwnAppDoc): Promise<UserOwnAppDoc>,
  getOrCreateFor(userID: string, ownApp: OwnAppDoc): Promise<UserOwnAppDoc>,
|}

export type UserOwnAppsCollection = Collection<UserOwnAppData> &
  UserOwnAppStatics

export default async (
  params: CollectionParams,
): Promise<UserOwnAppsCollection> => {
  const db = params.db

  return await db.collection<
    UserOwnAppData,
    UserOwnAppDoc,
    UserOwnAppMethods,
    UserOwnAppStatics,
  >({
    name: COLLECTION_NAMES.USER_OWN_APPS,
    schema,
    statics: {
      async createFor(userID: string, app: OwnAppDoc): Promise<UserOwnAppDoc> {
        const version = app.versions[0]
        if (version == null) {
          throw new Error('Missing own app version')
        }
        const settings = await db.user_app_settings.create({
          webDomains: version.webDomains,
        })
        return await this.insert({
          localID: generateLocalID(),
          ownApp: app.localID,
          settings: settings.localID,
          user: userID,
        })
      },

      async getOrCreateFor(
        userID: string,
        app: OwnAppDoc,
      ): Promise<UserOwnAppDoc> {
        const existing = await this.findOne({
          user: userID,
          ownApp: app.localID,
        }).exec()
        return existing ? existing : await this.createFor(userID, app)
      },
    },
    methods: {
      async getAppData(): Promise<AppData> {
        const app = await this.populate('ownApp')
        return {
          contentsPath: app.contentsPath,
          profile: app.profile,
          publicID: app.getPublicID(),
        }
      },
    },
  })
}
