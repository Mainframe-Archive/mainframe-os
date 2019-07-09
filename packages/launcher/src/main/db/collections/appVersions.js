// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'

import schema, { type AppVersionData } from '../schemas/appVersion'
import { generateLocalID } from '../utils'

import type { AppDoc } from './apps'
import type { DeveloperDoc } from './developers'

/* eslint-disable no-use-before-define */
type AppVersionMethods = {|
  getPublicID(): Promise<string>,
  getUpdate(): Promise<AppVersionDoc | null>,
  hasWebDomainsChangesFrom(previousVersion: AppVersionDoc): boolean,
|}
/* eslint-enable no-use-before-define */

export type AppVersionDoc = AppVersionData &
  AppVersionMethods &
  Populate<{
    app: AppDoc,
    developer: DeveloperDoc,
  }>

export type AppVersionStatics = {|
  create(data: $Shape<AppVersionData>): Promise<AppVersionDoc>,
  getOrCreate(data: $Shape<AppVersionData>): Promise<AppVersionDoc>,
  findByAppID(appID: string): Promise<Array<AppVersionDoc>>,
|}

export type AppVersionsCollection = Collection<AppVersionData, AppVersionDoc> &
  AppVersionStatics

export default async (
  params: CollectionParams,
): Promise<AppVersionsCollection> => {
  return await params.db.collection<
    AppVersionData,
    AppVersionDoc,
    AppVersionMethods,
    AppVersionStatics,
  >({
    name: COLLECTION_NAMES.APP_VERSIONS,
    schema,
    statics: {
      async create(data: $Shape<AppVersionData>): Promise<AppVersionDoc> {
        return await this.insert({ ...data, localID: generateLocalID() })
      },

      async getOrCreate(data: $Shape<AppVersionData>): Promise<AppVersionDoc> {
        if (data.app != null && data.manifest != null) {
          const existing = await this.findOne({
            app: data.app,
            'manifest.version': data.manifest.version,
          }).exec()
          if (existing != null) {
            return existing
          }
        }
        return await this.create(data)
      },

      async findByAppID(appID: string): Promise<Array<AppVersionDoc>> {
        return await this.find({ app: appID }).exec()
      },
    },
    methods: {
      async getPublicID(): Promise<string> {
        const app = await this.populate('app')
        return app.getPublicID()
      },

      async getUpdate(): Promise<AppVersionDoc | null> {
        const app = await this.populate('app')
        return app.latestAvailableVersion == null ||
          app.latestAvailableVersion === this.manifest.version
          ? null
          : app.populate('latestAvailableVersion')
      },

      hasWebDomainsChangesFrom(previousVersion: AppVersionDoc): boolean {
        const previousDomains = previousVersion.manifest.webDomains.reduce(
          (acc, w) => {
            acc[w.domain] = w
            return acc
          },
          {},
        )

        for (const w of this.manifest.webDomains) {
          const existing = previousDomains[w.domain]
          if (
            existing == null ||
            (w.internal && !existing.internal) ||
            (w.external && !existing.external)
          ) {
            return true
          }
        }

        return false
      },
    },
  })
}
