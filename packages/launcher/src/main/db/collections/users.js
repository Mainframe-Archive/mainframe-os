// @flow

import nanoid from 'nanoid'

import { createKeyPair, serializeKeyPair } from '../../crypto/ed25519'

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/user'
import type { UserProfile } from '../schemas/userProfile'

export default async (params: CollectionParams) => {
  return await params.db.collection({
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
      async addEthHDWallet(id: string) {
        await this.update({ $push: { 'ethWallets.hd': id } })
      },
      async addEthLedgerWallet(id: string) {
        await this.update({ $push: { 'ethWallets.ledger': id } })
      },
    },
  })
}
