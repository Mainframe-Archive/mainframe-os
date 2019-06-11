// @flow

import semver from 'semver'

import { MF_PREFIX } from '../../../constants'

import OwnFeed from '../../swarm/OwnFeed'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'
import { generateKeyPair, generateLocalID } from '../utils'

import schema, {
  type OwnAppData,
  type OwnAppVersionData,
} from '../schemas/ownApp'
import type { PermissionsRequirements } from '../schemas/appPermissionsRequirements'
import type { GenericProfile } from '../schemas/genericProfile'

import type { OwnDeveloperDoc } from './ownDevelopers'

export type CreateOwnAppData = {
  contentsPath: string,
  developer: string,
  permissions: PermissionsRequirements,
  profile: GenericProfile,
  version: string,
}

export type AppDetails = {
  contentsPath?: ?string,
  profile?: ?GenericProfile,
  version?: ?string,
}

type OwnAppMethods = {
  getPublicID(): string,
  getPublicFeed(): OwnFeed,
  getLatestPublishedVersion(): ?OwnAppVersionData,
  getInProgressVersion(): ?OwnAppVersionData,
  addVersion(data: { version: string }): Promise<void>,
  setDetails(data: AppDetails): Promise<void>,
  setPermissionsRequirements(
    permissions: PermissionsRequirements,
  ): Promise<void>,
}

export type OwnAppDoc = OwnAppData &
  OwnAppMethods &
  Populate<{ developer: OwnDeveloperDoc }>

type OwnAppsStatics = {
  create(data: CreateOwnAppData): Promise<OwnAppDoc>,
}

export type OwnAppsCollection = Collection<OwnAppData, OwnAppDoc> &
  OwnAppsStatics

export default async (params: CollectionParams): Promise<OwnAppsCollection> => {
  const db = params.db

  return await db.collection<
    OwnAppData,
    OwnAppDoc,
    OwnAppMethods,
    OwnAppsStatics,
  >({
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
        await this.atomicUpdate(doc => {
          const current = doc.versions[0]
          if (semver.lte(current.version, data.version)) {
            throw new Error('New version must be greater than current one')
          }
          doc.versions = [
            { version: data.version, permissions: current.permissions },
          ].concat(doc.versions)
          return doc
        })
      },

      async setDetails(data: AppDetails): Promise<void> {
        await this.atomicUpdate(doc => {
          if (data.contentsPath != null) {
            doc.contentsPath = data.contentsPath
          }
          if (data.profile != null) {
            doc.profile = data.profile
          }
          if (data.version != null) {
            const current = doc.versions.find(v => v.versionHash == null)
            if (current != null) {
              const published = doc.versions.find(v => v.versionHash != null)
              if (
                published != null &&
                semver.lte(published.version, data.version)
              ) {
                throw new Error('New version must be greater than current one')
              }
              current.version = data.version
            }
          }
          return doc
        })
      },

      async setPermissionsRequirements(
        permissions: PermissionsRequirements,
      ): Promise<void> {
        await this.atomicUpdate(doc => {
          const version = doc.versions.find(v => v.versionHash == null)
          if (version != null) {
            version.permissions = permissions
          }
          return doc
        })
      },
    },
  })
}
