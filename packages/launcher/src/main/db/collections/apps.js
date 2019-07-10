// @flow

import semver from 'semver'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import { MF_PREFIX } from '../../../constants'

import schema, { type AppData } from '../schemas/app'
import type { AppManifestData } from '../schemas/appManifest'
import { generateLocalID } from '../utils'

import type { AppVersionDoc } from './appVersions'
import type { DeveloperDoc } from './developers'

export type AppMetadata = {
  authorKey: string,
  manifest: AppManifestData,
}

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
  createFromFeed(publicID: string, meta: AppMetadata): Promise<AppDoc>,
  findByPublicID(publicID: string): Promise<AppDoc | null>,
  importFromFeed(publicID: string, meta: AppMetadata): Promise<AppDoc>,
|}

export type AppsCollection = Collection<AppData, AppDoc> & AppStatics

export default async (params: CollectionParams): Promise<AppsCollection> => {
  const db = params.db

  return await db.collection<AppData, AppDoc, AppMethods, AppStatics>({
    name: COLLECTION_NAMES.APPS,
    schema,
    statics: {
      async createFromFeed(
        publicID: string,
        meta: AppMetadata,
      ): Promise<AppDoc> {
        const developer = await db.developers.getOrCreateByPublicKey(
          meta.authorKey,
        )
        const app = this.newDocument({
          localID: generateLocalID(),
          developer: developer.localID,
          publicFeed: publicID.replace(MF_PREFIX.APP, '0x'),
        })
        const appVersion = await db.app_versions.create({
          app: app.localID,
          developer: developer.localID,
          manifest: meta.manifest,
        })
        app.latestAvailableVersion = appVersion.localID
        await app.save()
        return app
      },

      async findByPublicID(publicID: string): Promise<AppDoc | null> {
        return await this.findOne({
          publicFeed: publicID.replace(MF_PREFIX.APP, '0x'),
        }).exec()
      },

      async importFromFeed(
        publicID: string,
        meta: AppMetadata,
      ): Promise<AppDoc> {
        const app = await this.findByPublicID(publicID)
        if (app == null) {
          return await this.createFromFeed(publicID, meta)
        }

        // Check and update latest available version with the imported chapter if newer
        const appVersion = await app.populate('latestAvailableVersion')
        if (
          appVersion == null ||
          semver.gt(meta.manifest.version, appVersion.manifest.version)
        ) {
          await app.setLatestAvailableVersionFromManifest(meta.manifest)
        }

        return app
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
