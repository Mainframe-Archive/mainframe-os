// @flow

import { MF_PREFIX } from '../../../constants'

import OwnFeed from '../../swarm/OwnFeed'

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/ownApp'

export default async (params: CollectionParams) => {
  const db = params.db

  return await db.collection({
    name: COLLECTION_NAMES.OWN_APPS,
    schema,
    methods: {
      getPublicID(): string {
        return this.getPublicFeed().address.replace('0x', MF_PREFIX.APP)
      },

      getPublicFeed(): OwnFeed {
        if (this._publicFeed == null) {
          this._publicFeed = new OwnFeed(this.keyPair.privateKey)
        }
        return this._publicFeed
      },

      getLatestPublishedVersion(): ?Object {
        return this.versions.find(v => v.versionHash != null)
      },

      getInProgressVersion(): ?Object {
        return this.versions.find(v => v.versionHash == null)
      },
    },
  })
}
