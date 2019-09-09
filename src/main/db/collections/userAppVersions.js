// @flow

import type { AppData } from '../../../types'

import type { UserContext } from '../../context/user'
import type { Environment } from '../../environment'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'
import { generateLocalID } from '../utils'

import type { WebDomainsDefinitions } from '../schemas/appManifest'
import schema, { type UserAppVersionData } from '../schemas/userAppVersion'

import type { AppDoc } from './apps'
import type { AppVersionDoc } from './appVersions'
import type { UserAppSettingsDoc } from './userAppSettings'
import type { UserDoc } from './users'

type UserAppVersionMethods = {|
  getPublicID(): Promise<string>,
  getAppData(env: Environment): Promise<AppData>,
  getNewAvailableVersion(): Promise<AppVersionDoc | null>,
  downloadContents(ctx: UserContext): Promise<string>,
  applyUpdate(
    appVersionID: string,
    webDomains?: ?WebDomainsDefinitions,
  ): Promise<void>,
|}

export type UserAppVersionDoc = Doc<
  UserAppVersionData,
  UserAppVersionMethods,
  {
    app: AppDoc,
    appVersion: AppVersionDoc,
    settings: UserAppSettingsDoc,
    user: UserDoc,
  },
>

type UserAppVersionStatics = {|
  createFor(
    userID: string,
    appID: string,
    webDomains: WebDomainsDefinitions,
  ): Promise<UserAppVersionDoc>,
  getOrCreateFor(
    userID: string,
    appVersionID: string,
    webDomains: WebDomainsDefinitions,
  ): Promise<UserAppVersionDoc>,
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
      async createFor(
        userID: string,
        appVersionID: string,
        webDomains: WebDomainsDefinitions,
      ): Promise<UserAppVersionDoc> {
        const appVersion = await db.app_versions.findOne(appVersionID).exec()
        if (appVersion == null) {
          throw new Error('App version not found')
        }

        const settings = await db.user_app_settings.create({ webDomains })
        return await this.insert({
          localID: generateLocalID(),
          app: appVersion.app,
          appVersion: appVersionID,
          settings: settings.localID,
          user: userID,
        })
      },

      async getOrCreateFor(
        userID: string,
        appVersionID: string,
        webDomains: WebDomainsDefinitions,
      ): Promise<UserAppVersionDoc> {
        const existing = await this.findOne({
          user: userID,
          appVersion: appVersionID,
        }).exec()
        return existing
          ? existing
          : await this.createFor(userID, appVersionID, webDomains)
      },

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
        const [app, appVersion] = await Promise.all([
          this.populate('app'),
          this.populate('appVersion'),
        ])

        return {
          contentsPath: env.getAppContentsPath(
            app.getPublicID(),
            appVersion.manifest.version,
          ),
          profile: appVersion.manifest.profile || {},
          publicID: app.getPublicID(),
        }
      },

      async getNewAvailableVersion(): Promise<AppVersionDoc | null> {
        const [app, appVersion] = await Promise.all([
          this.populate('app'),
          this.populate('appVersion'),
        ])
        return app == null || appVersion == null
          ? null
          : await app.getAppVersionGreaterThan(appVersion.manifest.version)
      },

      async downloadContents(ctx: UserContext): Promise<string> {
        const appVersion = await this.populate('appVersion')
        return await appVersion.downloadContents(ctx)
      },

      async applyUpdate(
        appVersionID: string,
        webDomains?: ?WebDomainsDefinitions,
      ): Promise<void> {
        if (webDomains != null) {
          const settings = await this.populate('settings')
          await settings.atomicSet('webDomains', webDomains)
        }
        await this.atomicSet('appVersion', appVersionID)
      },
    },
  })
}
