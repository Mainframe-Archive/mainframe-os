// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import { MF_PREFIX } from '../../../constants'

import schema, { type AppData } from '../schemas/app'
import type { AppManifestData } from '../schemas/appManifest'
import { generateLocalID } from '../utils'

import type { AppVersionDoc } from './appVersions'
import type { DeveloperDoc } from './developers'

type AppMethods = {|
  getPublicID(): string,
  getVersions(): Promise<Array<AppVersionDoc>>,
  setLatestAvailableVersionFromManifest(
    manifest: AppManifestData,
  ): Promise<AppVersionDoc>,
|}

export type AppDoc = AppData &
  AppMethods &
  Populate<{
    developer: DeveloperDoc,
    latestAvailableVersion: ?AppVersionDoc,
    latestDownloadedVersion: ?AppVersionDoc,
  }>

type AppStatics = {|
  createFromManifest(manifest: AppManifestData): Promise<AppDoc>,
  findByPublicID(publicID: string): Promise<AppDoc | null>,
|}

export type AppsCollection = Collection<AppData, AppDoc> & AppStatics

export default async (params: CollectionParams): Promise<AppsCollection> => {
  const db = params.db

  return await db.collection<AppData, AppDoc, AppMethods, {}>({
    name: COLLECTION_NAMES.APPS,
    schema,
    statics: {
      async createFromManifest(manifest: AppManifestData): Promise<AppDoc> {
        const developer = await db.developers.getOrCreateByAddress(
          manifest.authorAddress,
        )
        const app = this.newDocument({
          localID: generateLocalID(),
          developer: developer.localID,
        })
        const appVersion = await db.app_versions.create({
          app: app.localID,
          developer: developer.localID,
          manifest,
        })
        app.latestAvailableVersion = appVersion.localID
        return await app.save()
      },

      async findByPublicID(publicID: string): Promise<AppDoc | null> {
        return await this.findOne({
          publicFeed: publicID.replace(MF_PREFIX.APP, '0x'),
        }).exec()
      },
    },
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.APP)
      },

      async getVersions(): Promise<Array<AppVersionDoc>> {
        return await db.app_versions.find({ app: this.localID }).exec()
      },

      async setLatestAvailableVersionFromManifest(
        manifest: AppManifestData,
      ): Promise<AppVersionDoc> {
        const appVersion = await db.app_versions.getOrCreate({
          app: this.localID,
          developer: this.developer,
          manifest,
        })
        await this.atomicSet('latestAvailableVersion', appVersion.localID)
        return appVersion
      },
    },
  })
}
