// @flow

import Bzz from '@erebos/api-bzz-node'
import { sign } from '@erebos/secp256k1'
import nanoid from 'nanoid'
import objectHash from 'object-hash'
import { debounceTime, filter, flatMap, map } from 'rxjs/operators'

import { MF_PREFIX } from '../../../constants'

import { createKeyPair, serializeKeyPair } from '../../crypto/ed25519'
import { writeProfile } from '../../data/protocols'
import OwnFeed from '../../swarm/OwnFeed'
import { createPublisher } from '../../swarm/feeds'

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/user'
import type { UserProfile } from '../schemas/userProfile'

export default async (params: CollectionParams) => {
  const logger = params.logger.child({ collection: COLLECTION_NAMES.USERS })

  return await params.db.collection({
    name: COLLECTION_NAMES.USERS,
    schema,
    statics: {
      async create(data: { profile: UserProfile, privateProfile?: boolean }) {
        return await this.insert({
          ...data,
          localID: nanoid(),
          keyPair: serializeKeyPair(createKeyPair()),
          publicFeed: OwnFeed.createJSON(),
          firstContactFeed: OwnFeed.createJSON(),
        })
      },

      async setupSync() {
        logger.log({
          level: 'debug',
          message: 'Setup collection sync',
        })
        const docs = await this.find().exec()
        docs.forEach(doc => {
          doc.setupSync()
        })
        this.insert$.subscribe(event => {
          event.doc.setupSync()
        })
      },
    },
    methods: {
      hasEthWallet(): boolean {
        return (
          this.ethWallets.hd.length > 0 || this.ethWallets.ledger.length > 0
        )
      },

      getBzz(): Bzz {
        if (this._bzz == null) {
          this._bzz = new Bzz({
            signBytes: async (bytes, key) => sign(bytes, key),
            url: this.bzzURL,
          })
        }
        return this._bzz
      },

      getPublicID(): string {
        return this.getPublicFeed().address.replace('0x', MF_PREFIX.CONTACT)
      },

      getPublicFeed(): OwnFeed {
        if (this._publicFeed == null) {
          this._publicFeed = new OwnFeed(this.publicFeed.privateKey)
        }
        return this._publicFeed
      },

      getFirstContactFeed(): OwnFeed {
        if (this._firstContactFeed == null) {
          this._firstContactFeed = new OwnFeed(this.firstContactFeed.privateKey)
        }
        return this._firstContactFeed
      },

      async addEthHDWallet(id: string): Promise<void> {
        await this.update({ $push: { 'ethWallets.hd': id } })
      },

      async addEthLedgerWallet(id: string): Promise<void> {
        await this.update({ $push: { 'ethWallets.ledger': id } })
      },

      startPublicProfilePublication() {
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
          bzz: this.getBzz(),
          feed: this.getPublicFeed(),
          transform: writeProfile,
        })
        this._publicProfilePublication = this.profile$
          .pipe(
            debounceTime(10000),
            map(profile => ({ hash: objectHash(profile), profile })),
            filter(data => data.hash !== this.profileHash),
            flatMap(async data => {
              const hash = await publish(data.profile)
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

      setupPublicProfilePublication() {
        if (this._publicProfilePublicationToggle == null) {
          logger.log({
            level: 'debug',
            message: 'Setup public profile publication',
            id: this.localID,
          })
          this._publicProfilePublicationToggle = this.privateProfile$.subscribe(
            {
              next: (isPrivate: boolean) => {
                if (isPrivate && this._publicProfilePublication != null) {
                  this.stopPublicProfilePublication()
                } else if (
                  !isPrivate &&
                  this._publicProfilePublication == null
                ) {
                  this.startPublicProfilePublication()
                }
              },
              error: err => {
                logger.log({
                  level: 'error',
                  message:
                    'Public profile publication toggle subscription error',
                  id: this.localID,
                  error: err.toString(),
                })
              },
            },
          )
        } else {
          logger.log({
            level: 'warn',
            message: 'Public profile publication is already setup',
            id: this.localID,
          })
        }
      },

      setupSync() {
        logger.log({
          level: 'debug',
          message: 'Setup document sync',
          id: this.localID,
        })

        this.setupPublicProfilePublication()

        this.deleted$.subscribe(deleted => {
          if (deleted) {
            logger.log({
              level: 'debug',
              message: 'Cleanup deleted document sync',
              id: this.localID,
            })
            this.stopPublicProfilePublication()
            if (this._publicProfilePublicationToggle != null) {
              this._publicProfilePublicationToggle.unsubscribe()
              this._publicProfilePublicationToggle = null
            }
          }
        })
      },
    },
  })
}
