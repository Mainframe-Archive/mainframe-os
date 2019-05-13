// @flow

import Bzz from '@erebos/api-bzz-node'
import { sign } from '@erebos/secp256k1'
import nanoid from 'nanoid'

import { MF_PREFIX } from '../../../constants'

import { createKeyPair, serializeKeyPair } from '../../crypto/ed25519'
import { OwnFeed } from '../../swarm'

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
          publicFeed: OwnFeed.createJSON(),
          firstContactFeed: OwnFeed.createJSON(),
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

      async addEthHDWallet(id: string) {
        await this.update({ $push: { 'ethWallets.hd': id } })
      },

      async addEthLedgerWallet(id: string) {
        await this.update({ $push: { 'ethWallets.ledger': id } })
      },

      async setProfileEthAddress(address: string) {
        const profile = { ...this.profile }
        profile.ethAddress = address
        await this.update({ $set: { profile } })
      },
    },
  })
}
