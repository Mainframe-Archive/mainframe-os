// @flow

import type Bzz from '@erebos/api-bzz-node'
import { createPublic } from '@erebos/secp256k1'
import { Subscription } from 'rxjs'
import { flatMap } from 'rxjs/operators'

import { MF_PREFIX } from '../../../constants'

import { readPeer } from '../../data/protocols'
import { createSubscriber, readJSON } from '../../swarm/feeds'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'
import { generateLocalID } from '../utils'

import schema, { type PeerData } from '../schemas/peer'

import type { UserDoc } from './users'

export type FirstContactData = {|
  userAddress: string,
  peerAddress: string,
  sharedKey: Buffer,
|}

type PeerMethods = {|
  getPublicID(): string,
  getPublicKey(): ?string,
  getFirstContactData(user: UserDoc): Promise<FirstContactData>,
  startPublicFeedSubscription(bzz: Bzz): rxjs$TeardownLogic,
  stopPublicFeedSubscription(): void,
  startSync(bzz: Bzz): rxjs$TeardownLogic,
  stopSync(): void,
|}

export type PeerDoc = PeerData & PeerMethods

type PeersStatics = {|
  createFromID(bzz: Bzz, publicID: string): Promise<PeerDoc>,
  findByPublicID(publicID: string): Promise<PeerDoc | null>,
  startSync(bzz: Bzz): Promise<void>,
  stopSync(): void,
|}

export type PeersCollection = Collection<PeerData, PeerDoc> & PeersStatics

export default async (params: CollectionParams): Promise<PeersCollection> => {
  const logger = params.logger.child({ collection: COLLECTION_NAMES.PEERS })

  return await params.db.collection<
    PeerData,
    PeerDoc,
    PeerMethods,
    PeersStatics,
  >({
    name: COLLECTION_NAMES.PEERS,
    schema,
    statics: {
      async createFromID(bzz: Bzz, publicID: string): Promise<PeerDoc> {
        const publicFeed = publicID.replace(MF_PREFIX.PEER, '0x')
        const payload = await readJSON(bzz, { user: publicFeed })
        if (payload == null) {
          throw new Error('Peer data not found')
        }

        const data = await readPeer(payload)
        return await this.insert({
          localID: generateLocalID(),
          publicFeed,
          publicKey: data.publicKey,
          profile: data.profile,
        })
      },

      async findByPublicID(publicID: string): Promise<PeerDoc | null> {
        return await this.findOne({
          publicFeed: publicID.replace(MF_PREFIX.PEER, '0x'),
        }).exec()
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
        return this.publicFeed.replace('0x', MF_PREFIX.PEER)
      },

      getPublicKey(): ?string {
        if (this._publicKey == null && this.publicKey != null) {
          this._publicKey = createPublic(this.publicKey).getPublic()
        }
        return this._publicKey
      },

      async getFirstContactData(user: UserDoc): Promise<FirstContactData> {
        const pubKey = this.getPublicKey()
        if (pubKey == null) {
          throw new Error('Missing peer public key')
        }
        return {
          userAddress: user.getPublicFeed().address,
          peerAddress: this.publicFeed,
          sharedKey: user.getSharedKey(pubKey),
        }
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
          transform: readPeer,
        })
          .pipe(
            flatMap(async data => {
              await this.atomicUpdate(doc => {
                if (data.profile != null) {
                  doc.profile = data.profile
                }
                if (data.publicKey != null) {
                  doc.publicKey = data.publicKey
                }
                return doc
              })
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
