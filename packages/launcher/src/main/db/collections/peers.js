// @flow

import type Bzz from '@erebos/api-bzz-node'
import { flatMap } from 'rxjs/operators'

import { MF_PREFIX } from '../../../constants'

import { readProfile } from '../../data/protocols'
import { createSubscriber } from '../../swarm/feeds'

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/peer'

export default async (params: CollectionParams) => {
  const logger = params.logger.child({ collection: COLLECTION_NAMES.PEERS })

  return await params.db.collection({
    name: COLLECTION_NAMES.PEERS,
    schema,
    statics: {
      async setupSync(bzz: Bzz) {
        logger.debug('Setup collection sync')

        const docs = await this.find().exec()
        docs.forEach(doc => {
          doc.setupSync(bzz)
        })

        this.insert$
          .pipe(
            flatMap(async event => {
              const doc = await this.findOne(event.doc).exec()
              doc.setupSync()
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
          })
      },
    },
    methods: {
      getPublicID(): string {
        return this.publicFeed.replace('0x', MF_PREFIX.CONTACT)
      },

      startPublicFeedSubscription(bzz: Bzz) {
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
          transform: readProfile,
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
      },

      stopPublicFeedPublication() {
        if (this._publicFeedPublication != null) {
          logger.log({
            level: 'debug',
            message: 'Stop public profile subscription',
            id: this.localID,
          })
          this._publicFeedPublication.unsubscribe()
          this._publicFeedPublication = null
        }
      },

      setupSync(bzz: Bzz) {
        logger.log({
          level: 'debug',
          message: 'Setup document sync',
          id: this.localID,
        })

        this.startPublicFeedSubscription(bzz)

        this.deleted$.subscribe(deleted => {
          if (deleted) {
            logger.log({
              level: 'debug',
              message: 'Cleanup deleted document sync',
              id: this.localID,
            })
            this.stopPublicFeedSubscription()
          }
        })
      },
    },
  })
}
