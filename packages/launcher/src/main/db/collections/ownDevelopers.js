// @flow

import Bzz from '@erebos/api-bzz-node'
import objectHash from 'object-hash'
import { Subscription } from 'rxjs'
import { debounceTime, filter, flatMap, map } from 'rxjs/operators'

import { MF_PREFIX } from '../../../constants'

import { writeDeveloper } from '../../data/protocols'
import OwnFeed from '../../swarm/OwnFeed'
import { createPublisher } from '../../swarm/feeds'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'
import { generateKeyPair, generateLocalID } from '../utils'

import schema, { type OwnDeveloperData } from '../schemas/ownDeveloper'
import type { GenericProfile } from '../schemas/genericProfile'

import type { OwnAppDoc } from './ownApps'

export type OwnDeveloperDoc = OwnDeveloperData & {
  getPublicID(): string,
  getPublicFeed(): OwnFeed,
  getApps(): Promise<Array<OwnAppDoc>>,
  startPublicProfilePublication(bzz: Bzz): rxjs$TeardownLogic,
  stopPublicProfilePublication(): void,
  startSync(bzz: Bzz): rxjs$TeardownLogic,
  stopSync(): void,
}

type OwnDevelopersStatics = {
  create(data: { profile: GenericProfile }): Promise<OwnDeveloperDoc>,
  startSync(bzz: Bzz): Promise<void>,
  stopSync(): void,
}

export type OwnDevelopersCollection = Collection<
  OwnDeveloperData,
  OwnDeveloperDoc,
> &
  OwnDevelopersStatics

export default async (
  params: CollectionParams,
): Promise<OwnDevelopersCollection> => {
  const db = params.db
  const logger = params.logger.child({
    collection: COLLECTION_NAMES.OWN_DEVELOPERS,
  })

  return await db.collection({
    name: COLLECTION_NAMES.OWN_DEVELOPERS,
    schema,
    statics: {
      async create(data: {
        profile: GenericProfile,
      }): Promise<OwnDeveloperDoc> {
        return await this.insert({
          ...data,
          localID: generateLocalID(),
          keyPair: generateKeyPair(),
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
        return this.getPublicFeed().address.replace('0x', MF_PREFIX.DEVELOPER)
      },

      getPublicFeed(): OwnFeed {
        if (this._publicFeed == null) {
          this._publicFeed = new OwnFeed(this.keyPair.privateKey)
        }
        return this._publicFeed
      },

      getApps(): Promise<Array<OwnAppDoc>> {
        return db.own_apps.find({ developer: this.localID }).exec()
      },

      startPublicProfilePublication(bzz: Bzz): rxjs$TeardownLogic {
        if (this._publicProfilePublication != null) {
          logger.log({
            level: 'warn',
            message: 'Public profile publication is already started',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start public profile publication',
          id: this.localID,
        })

        const publish = createPublisher({
          bzz,
          feed: this.getPublicFeed(),
          transform: writeDeveloper, // TODO: new transform for developer
        })

        // TODO: also add subscriptions to own apps and filter if developer is self
        // Publish profile when profile or apps change

        this._publicProfilePublication = this.profile$
          .pipe(
            debounceTime(10000),
            map(profile => ({ hash: objectHash(profile), profile })),
            filter(data => data.hash !== this.profileHash),
            flatMap(async data => {
              const hash = await publish({
                publicKey: this.keyPair.publicKey,
                profile: data.profile,
              })
              await this.atomicSet('profileHash', data.hash)
              return { hash, profile: data.profile }
            }),
          )
          .subscribe({
            next: data => {
              logger.log({
                level: 'debug',
                message: 'Public profile published',
                id: this.localID,
                data,
              })
            },
            error: err => {
              logger.log({
                level: 'error',
                message: 'Public profile publication error',
                id: this.localID,
                error: err.toString(),
              })
            },
          })

        return () => {
          this.stopPublicProfilePublication()
        }
      },

      stopPublicProfilePublication() {
        if (this._publicProfilePublication != null) {
          logger.log({
            level: 'debug',
            message: 'Stop public profile publication',
            id: this.localID,
          })
          this._publicProfilePublication.unsubscribe()
          this._publicProfilePublication = null
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
        this._sync.add(this.startPublicProfilePublication(bzz))

        return () => {
          this.stopSync()
        }
      },

      stopSync() {
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
