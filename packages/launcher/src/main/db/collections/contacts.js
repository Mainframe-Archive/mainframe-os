// @flow

import { createKeyPair } from '@erebos/secp256k1'
import nanoid from 'nanoid'

import { MF_PREFIX } from '../../../constants'

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/contact'
import { generateKeyPair } from '../utils'

export default async (params: CollectionParams) => {
  const db = params.db
  const logger = params.logger.child({ collection: COLLECTION_NAMES.CONTACTS })

  return await db.collection({
    name: COLLECTION_NAMES.CONTACTS,
    schema,
    statics: {
      async create(data: Object = {}) {
        return await this.insert({
          ...data,
          localID: nanoid(),
          keyPair: generateKeyPair(),
        })
      },
    },
    methods: {
      // Alias to ID of the peer
      async getPublicID(): Promise<string> {
        const peer = await this.populate('peer')
        return peer.getPublicID()
      },

      // Own ID specific to provide to the contact for confidential first contact feed access
      async getPrivateID(): Promise<string> {
        return MF_PREFIX.CONTACT + this.keyPair.publicKey
      },

      async getUser(): Promise<Object | null> {
        const user = await db.users
          .findOne({ contacts: { $in: [this.localID] } })
          .exec()
        if (user === null) {
          logger.log({
            level: 'warn',
            message: 'Could not find user for contact',
            id: this.localID,
          })
        }
        return user
      },

      // Key to use to read the feed data encrypted by the contact
      async getReadKey(): Promise<?Buffer> {
        const peer = await this.populate('peer')
        const peerKey = peer.getPublicKey()
        if (peerKey != null) {
          return createKeyPair(this.keyPair.privateKey)
            .derive(peerKey)
            .toBuffer()
        }
      },

      // Key to use to encrypt the feed data published to the contact
      async getWriteKey(): Promise<?Buffer> {
        const [peer, user] = await Promise.all([
          this.populate('peer'),
          this.getUser(),
        ])
        const peerKey = peer.getPublicKey()
        if (peerKey != null && user !== null) {
          return user.getSharedKey(peerKey)
        }
      },
    },
  })
}
