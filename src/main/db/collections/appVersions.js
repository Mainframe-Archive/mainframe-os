// @flow

import type { UserContext } from '../../context/user'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'

import schema, {
  type AppInstallationState,
  type AppVersionData,
} from '../schemas/appVersion'
import { generateLocalID } from '../utils'

import type { AppDoc } from './apps'
import type { DeveloperDoc } from './developers'

/* eslint-disable no-use-before-define */
type AppVersionMethods = {|
  getPublicID(): Promise<string>,
  getUpdate(): Promise<AppVersionDoc | null>,
  downloadContents(ctx: UserContext): Promise<string>,
  hasWebDomainsChangesFrom(previousVersion: AppVersionDoc): boolean,
|}
/* eslint-enable no-use-before-define */

export type AppVersionDoc = Doc<
  AppVersionData,
  AppVersionMethods,
  {
    app: AppDoc,
    developer: DeveloperDoc,
  },
>

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
        return await app.getAppVersionGreaterThan(this.manifest.version)
      },

      async downloadContents(ctx: UserContext): Promise<string> {
        const [app, bzz] = await Promise.all([
          this.populate('app'),
          ctx.getBzz(),
        ])
        const toPath = ctx.system.env.getAppContentsPath(
          app.getPublicID(),
          this.manifest.version,
        )

        if (this.installationState === 'done') {
          return toPath
        }

        if (this.installationState === 'downloading') {
          // If already downloading, watch for installationState change
          return new Promise((resolve, reject) => {
            const sub = this.get$('installationState').subscribe({
              next: (state: AppInstallationState) => {
                sub.unsubscribe()
                if (state === 'done') {
                  resolve(toPath)
                } else {
                  reject(new Error('Installation failed'))
                }
              },
              error: (err: Error) => {
                reject(err)
              },
            })
          })
        }

        try {
          await this.atomicSet('installationState', 'downloading')
          await bzz.downloadDirectoryTo(this.manifest.contentsHash, toPath)
          await app.handleDownloadedVersion(this)
          await this.atomicSet('installationState', 'done')
          return toPath
        } catch (err) {
          await this.atomicSet('installationState', 'failed')
          throw err
        }
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
