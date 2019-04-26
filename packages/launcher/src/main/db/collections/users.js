// @flow

import nanoid from 'nanoid'
import type { RxDatabase } from 'rxdb'

import { createKeyPair, serializeKeyPair } from '../../crypto/ed25519'

import { COLLECTION_NAMES } from '../constants'
import schema from '../schemas/user'
import type { UserProfile } from '../schemas/userProfile'

export default async (db: RxDatabase) => {
  return await db.collection({
    name: COLLECTION_NAMES.USERS,
    schema,
    statics: {
      async create(data: { profile: UserProfile, privateProfile?: boolean }) {
        return await this.insert({
          ...data,
          localID: nanoid(),
          keyPair: serializeKeyPair(createKeyPair()),
        })
      },
    },
    methods: {
      hasEthWallet(): boolean {
        return (
          this.ethWallets.hd.length > 0 || this.ethWallets.ledger.length > 0
        )
      },
    },
  })
}
