// @flow

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'
import { generateLocalID } from '../utils'
import schema from '../schemas/contactRequest'

export default async (params: CollectionParams) => {
  return await params.db.collection({
    name: COLLECTION_NAMES.CONTACT_REQUESTS,
    schema,
    statics: {
      async create(data: Object = {}) {
        return await this.insert({
          ...data,
          localID: generateLocalID(),
        })
      },
    },
    methods: {
      async getPublicID(): Promise<string> {
        const peer = await this.populate('peer')
        return peer.getPublicID()
      },

      // Used for the GraphQL object
      async getInfo() {
        const peer = await this.populate('peer')

        return {
          localID: this.localID,
          peerID: peer.localID,
          publicID: peer.getPublicID(),
          connectionState: 'received',
          profile: peer.profile,
          stakeAmount: this.stakeAmount,
          receivedAddress: this.receivedAddress,
          ethNetwork: this.ethNetwork,
          rejectedTXHash: this.rejectedTXHash,
        }
      },
    },
  })
}
