// @flow

import type { Bzz } from '@erebos/api-bzz-node'
import { Timeline } from '@erebos/timeline'
import { Subscription } from 'rxjs'
import { flatMap } from 'rxjs/operators'
import semver from 'semver'

import { MF_PREFIX } from '../../../constants'

import { DEFAULT_POLL_INTERVAL } from '../../swarm/feeds'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'

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
  getLatestAppVersion(): Promise<AppVersionDoc | null>,
  getAppVersionGreaterThan(version: string): Promise<AppVersionDoc | null>,
  setLatestAvailableVersionFromManifest(
    manifest: AppManifestData,
  ): Promise<AppVersionDoc>,
  handleDownloadedVersion(appVersion: AppVersionDoc): Promise<void>,
  safeRemove(): Promise<void>,
  startUpdatesSubscription(bzz: Bzz): rxjs$TeardownLogic,
  stopUpdatesSubscription(): void,
  startSync(bzz: Bzz): rxjs$TeardownLogic,
  stopSync(): void,
|}

export type AppDoc = Doc<
  AppData,
  AppMethods,
  {
    developer: DeveloperDoc,
    latestAvailableVersion: ?AppVersionDoc,
    latestDownloadedVersion: ?AppVersionDoc,
  },
>

type AppStatics = {|
  createFromFeed(publicID: string, meta: AppMetadata): Promise<AppDoc>,
  findByPublicID(publicID: string): Promise<AppDoc | null>,
  importFromFeed(publicID: string, meta: AppMetadata): Promise<AppDoc>,
  startSync(bzz: Bzz): Promise<void>,
  stopSync(): void,
|}

export type AppsCollection = Collection<AppData, AppDoc> & AppStatics

export default async (params: CollectionParams): Promise<AppsCollection> => {
  const db = params.db
  const logger = params.logger.child({ collection: COLLECTION_NAMES.APPS })

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

      async startSync(bzz: Bzz): Promise<void> {
        if (this._sync != null) {
          logger.warn('Collection already syncing, ignoring startSync() call')
          return
        }

        logger.debug('Start collection sync')
        this._sync = new Subscription()

        const docs = await this.find().exec()
        docs.forEach(doc => {
          this._sync.add(doc.startSync(bzz))
        })

        this._sync.add(
          this.insert$
            .pipe(
              flatMap(async event => {
                const doc = await this.findOne(event.data.doc).exec()
                this._sync.add(doc.startSync(bzz))
              }),
            )
            .subscribe({
              error: err => {
                logger.log({
                  level: 'error',
                  message: 'Collection sync error with added doc',
                  error: err.toString(),
                })
              },
            }),
        )
      },

      stopSync(): void {
        if (this._sync != null) {
          logger.debug('Stop collection sync')
          this._sync.unsubscribe()
          this._sync = null
        }
      },
    },
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.APP)
      },

      async getVersions(): Promise<Array<AppVersionDoc>> {
        return await db.app_versions.find({ app: this.localID }).exec()
      },

      async getLatestAppVersion(): Promise<AppVersionDoc | null> {
        let appVersion = null
        if (this.latestAvailableVersion != null) {
          appVersion = await this.populate('latestAvailableVersion')
        }
        if (appVersion == null && this.latestDownloadedVersion != null) {
          appVersion = await this.populate('latestDownloadedVersion')
        }
        return appVersion
      },

      async getAppVersionGreaterThan(
        version: string,
      ): Promise<AppVersionDoc | null> {
        const appVersion = await this.getLatestAppVersion()
        return appVersion != null &&
          semver.gt(appVersion.manifest.version, version)
          ? appVersion
          : null
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

      async handleDownloadedVersion(appVersion: AppVersionDoc): Promise<void> {
        const [downloadedVersion, availableVersion] = await Promise.all([
          this.populate('latestDownloadedVersion'),
          this.populate('latestAvailableVersion'),
        ])
        await this.atomicUpdate(doc => {
          if (
            downloadedVersion === null ||
            semver.gt(
              appVersion.manifest.version,
              downloadedVersion.manifest.version,
            )
          ) {
            doc.latestDownloadedVersion = appVersion.localID
          }
          if (
            availableVersion !== null &&
            semver.gte(
              appVersion.manifest.version,
              availableVersion.manifest.version,
            )
          ) {
            doc.latestAvailableVersion = undefined
          }
          return doc
        })
      },

      async safeRemove(): Promise<void> {
        const versions = await db.app_versions
          .find({ app: this.localID })
          .exec()
        await Promise.all(versions.map(v => v.remove()))
        await this.remove()
      },

      startUpdatesSubscription(bzz: Bzz): rxjs$TeardownLogic {
        if (this._updatesSubscription != null) {
          logger.log({
            level: 'warn',
            message: 'Updates subscription is already started',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start updates subscription',
          id: this.localID,
        })

        const timeline = new Timeline({ bzz, feed: { user: this.publicFeed } })
        this._updatesSubscription = timeline
          .pollLatestChapter({ interval: DEFAULT_POLL_INTERVAL })
          .pipe(
            flatMap(async chapter => {
              await this.setLatestAvailableVersionFromManifest(
                chapter.content.manifest,
              )
            }),
          )
          .subscribe({
            next: () => {
              logger.log({
                level: 'debug',
                message: 'Latest available version updated locally',
                id: this.localID,
              })
            },
            error: err => {
              logger.log({
                level: 'error',
                message: 'Updates subscription error',
                id: this.localID,
                error: err.toString(),
              })
            },
          })

        return () => {
          this.stopUpdatesSubscription()
        }
      },

      stopUpdatesSubscription(): void {
        if (this._updatesSubscription != null) {
          logger.log({
            level: 'debug',
            message: 'Stop updates subscription',
            id: this.localID,
          })
          this._updatesSubscription.unsubscribe()
          this._updatesSubscription = null
        }
      },

      startSync(bzz: Bzz): rxjs$TeardownLogic {
        if (this._sync != null) {
          logger.log({
            level: 'warn',
            message: 'Document is already syncing, ignoring startSync() call',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start document sync',
          id: this.localID,
        })

        const deletedSub = this.deleted$.subscribe(deleted => {
          if (deleted) {
            logger.log({
              level: 'debug',
              message: 'Cleanup deleted document sync',
              id: this.localID,
            })
            this.stopSync()
          }
        })

        this._sync = new Subscription()
        this._sync.add(deletedSub)
        this._sync.add(this.startUpdatesSubscription(bzz))

        return () => {
          this.stopSync()
        }
      },

      stopSync(): void {
        if (this._sync != null) {
          logger.log({
            level: 'debug',
            message: 'Stop document sync',
            id: this.localID,
          })
          this._sync.unsubscribe()
          this._sync = null
        }
      },
    },
  })
}
