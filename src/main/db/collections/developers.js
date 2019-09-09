// @flow

import type { Bzz } from '@erebos/api-bzz-node'
import { pubKeyToAddress } from '@erebos/keccak256'
import { Subscription } from 'rxjs'
import { flatMap } from 'rxjs/operators'

import { MF_PREFIX } from '../../../constants'

import { readDeveloper } from '../../data/protocols'
import { createSubscriber, readJSON } from '../../swarm/feeds'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'
import schema, { type DeveloperData } from '../schemas/developer'
import { generateLocalID } from '../utils'

import type { AppDoc } from './apps'

type DeveloperMethods = {|
  getPublicID(): string,
  getApps(): Promise<Array<AppDoc>>,
  startPublicFeedSubscription(bzz: Bzz): rxjs$TeardownLogic,
  stopPublicFeedSubscription(): void,
  startSync(bzz: Bzz): rxjs$TeardownLogic,
  stopSync(): void,
|}

export type DeveloperDoc = Doc<DeveloperData, DeveloperMethods>

type DeveloperStatics = {|
  getOrCreateByPublicKey(publicKey: string): Promise<DeveloperDoc>,
  startSync(bzz: Bzz): Promise<void>,
  stopSync(): void,
|}

export type DevelopersCollection = Collection<DeveloperData, DeveloperDoc> &
  DeveloperStatics

export default async (
  params: CollectionParams,
): Promise<DevelopersCollection> => {
  const db = params.db
  const logger = params.logger.child({
    collection: COLLECTION_NAMES.DEVELOPERS,
  })

  return await db.collection<
    DeveloperData,
    DeveloperDoc,
    DeveloperMethods,
    DeveloperStatics,
  >({
    name: COLLECTION_NAMES.DEVELOPERS,
    schema,
    statics: {
      async getOrCreateByPublicKey(
        publicKey: string,
        bzz: Bzz,
      ): Promise<DeveloperDoc> {
        const existing = await this.findOne({ publicKey }).exec()
        if (existing != null) {
          return existing
        }

        const publicFeed = pubKeyToAddress(Buffer.from(publicKey, 'hex'))

        let profile = {}
        try {
          const payload = await readJSON(bzz, { user: publicFeed })
          if (payload != null) {
            const dev = await readDeveloper(payload)
            profile = dev.profile || {}
          }
        } catch (err) {
          logger.log({
            level: 'warn',
            message: 'Could not load developer public feed',
            publicFeed,
          })
        }

        return await this.insert({
          localID: generateLocalID(),
          publicFeed,
          publicKey,
          profile,
        })
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

      stopSync() {
        if (this._sync != null) {
          logger.debug('Stop collection sync')
          this._sync.unsubscribe()
          this._sync = null
        }
      },
    },
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.DEVELOPER)
      },

      async getApps(): Promise<Array<AppDoc>> {
        return await db.apps.find({ developer: this.localID }).exec()
      },

      startPublicFeedSubscription(bzz: Bzz): rxjs$TeardownLogic {
        if (this._publicFeedSubscription != null) {
          logger.log({
            level: 'warn',
            message: 'Public profile subscription is already started',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start public profile subscription',
          id: this.localID,
        })

        this._publicFeedSubscription = createSubscriber({
          bzz,
          feed: { user: this.publicFeed },
          transform: readDeveloper,
        })
          .pipe(
            flatMap(async data => {
              if (data.profile != null) {
                await this.atomicSet('profile', data.profile)
              }
              return data
            }),
          )
          .subscribe({
            next: data => {
              logger.log({
                level: 'debug',
                message: 'Public profile updated locally',
                id: this.localID,
                data,
              })
            },
            error: err => {
              logger.log({
                level: 'error',
                message: 'Public profile subscription error',
                id: this.localID,
                error: err.toString(),
              })
            },
          })

        return () => {
          this.stopPublicFeedSubscription()
        }
      },

      stopPublicFeedSubscription(): void {
        if (this._publicFeedSubscription != null) {
          logger.log({
            level: 'debug',
            message: 'Stop public profile subscription',
            id: this.localID,
          })
          this._publicFeedSubscription.unsubscribe()
          this._publicFeedSubscription = null
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
        this._sync.add(this.startPublicFeedSubscription(bzz))

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
