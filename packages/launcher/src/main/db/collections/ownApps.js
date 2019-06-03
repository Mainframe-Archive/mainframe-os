// @flow

import { MF_PREFIX } from '../../../constants'

import OwnFeed from '../../swarm/OwnFeed'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'
import { generateKeyPair, generateLocalID } from '../utils'

import schema, {
  type OwnAppData,
  type OwnAppVersionData,
} from '../schemas/ownApp'
import type { GenericProfile } from '../schemas/genericProfile'

export type CreateOwnAppData = {
  contentsPath: string,
  developer: string,
  permissions: Object,
  profile: GenericProfile,
  version: string,
}

export type OwnAppDoc = OwnAppData & {
  getPublicID(): string,
  getPublicFeed(): OwnFeed,
  getLatestPublishedVersion(): ?OwnAppVersionData,
  getInProgressVersion(): ?OwnAppVersionData,
  addVersion(data: { version: string }): Promise<void>,
}

export type OwnAppsCollection = Collection<OwnAppDoc, OwnAppData> & {
  create(data: CreateOwnAppData): Promise<OwnAppDoc>,
}

export default async (params: CollectionParams) => {
  const db = params.db

  return await db.collection({
    name: COLLECTION_NAMES.OWN_APPS,
    schema,
    statics: {
      async create(data: CreateOwnAppData): Promise<OwnAppDoc> {
        return await this.insert({
          localID: generateLocalID(),
          keyPair: generateKeyPair(),
          developer: data.developer,
          contentsPath: data.contentsPath,
          profile: data.profile,
          versions: [
            {
              version: data.version,
              permissions: data.permissions,
            },
          ],
        })
      },
    },
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

      getLatestPublishedVersion(): ?OwnAppVersionData {
        return this.versions.find(v => v.versionHash != null)
      },

      getInProgressVersion(): ?OwnAppVersionData {
        return this.versions.find(v => v.versionHash == null)
      },

      async addVersion(data: { version: string }): Promise<void> {
        // TODO: additional validation of the new version using semver
        await this.atomicUpdate(doc => {
          const current = doc.versions[0]
          doc.versions = [
            { version: data.version, permissions: current.permissions },
          ].concat(doc.versions)
          return doc
        })
      },
    },
  })
}
