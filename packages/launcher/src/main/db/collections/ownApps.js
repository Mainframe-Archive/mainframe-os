// @flow

import type Bzz from '@erebos/api-bzz-node'
import { createKeyPair, type KeyPair } from '@erebos/secp256k1'
import { pubKeyToAddress } from '@erebos/keccak256'
import { Timeline } from '@erebos/timeline'
import semver from 'semver'

import { MF_PREFIX } from '../../../constants'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Populate } from '../types'
import { generateKeyPair, generateLocalID } from '../utils'

import type { AppManifestData } from '../schemas/appManifest'
import schema, {
  type OwnAppData,
  type OwnAppVersionData,
} from '../schemas/ownApp'
import type { PermissionsRequirements } from '../schemas/appPermissionsRequirements'
import type { GenericProfile } from '../schemas/genericProfile'

import type { OwnDeveloperDoc } from './ownDevelopers'
import type { UserAppSettingsDoc } from './userAppSettings'
import type { UserOwnAppDoc } from './userOwnApps'

export type CreateOwnAppData = {|
  contentsPath: string,
  developer: string,
  permissions: PermissionsRequirements,
  profile: GenericProfile,
  version: string,
|}

export type AppDetails = {
  contentsPath?: ?string,
  profile?: ?GenericProfile,
  version?: ?string,
}

type OwnAppMethods = {|
  getKeyPair(): KeyPair,
  getPublicID(): string,
  getTimeline(bzz: Bzz): Timeline<AppManifestData>,
  getLatestPublishedVersion(): ?OwnAppVersionData,
  getInProgressVersion(): ?OwnAppVersionData,
  getUserOwnApp(userID: string): Promise<UserOwnAppDoc>,
  getUserAppSettings(userID: string): Promise<UserAppSettingsDoc>,
  addVersion(data: { version: string }): Promise<void>,
  setDetails(data: AppDetails): Promise<void>,
  setPermissionsRequirements(
    permissions: PermissionsRequirements,
  ): Promise<void>,
  publishVersion(bzz: Bzz): Promise<string>,
|}

export type OwnAppDoc = OwnAppData &
  OwnAppMethods &
  Populate<{ developer: OwnDeveloperDoc }>

type OwnAppsStatics = {|
  create(data: CreateOwnAppData): Promise<OwnAppDoc>,
|}

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
      getKeyPair(): KeyPair {
        return createKeyPair(this.keyPair.privateKey)
      },

      getPublicID(): string {
        const pubKey = this.getKeyPair()
          .getPublic()
          .encode()
        return pubKeyToAddress(pubKey).replace('0x', MF_PREFIX.APP)
      },

      getTimeline(bzz: Bzz): Timeline<AppManifestData> {
        const keyPair = this.getKeyPair()
        return new Timeline<AppManifestData>({
          bzz,
          feed: { user: pubKeyToAddress(keyPair.getPublic().encode()) },
          signParams: keyPair.getPrivate(),
        })
      },

      getLatestPublishedVersion(): ?OwnAppVersionData {
        return this.versions.find(v => v.versionHash != null)
      },

      getInProgressVersion(): ?OwnAppVersionData {
        return this.versions.find(v => v.versionHash == null)
      },

      async getUserOwnApp(userID: string): Promise<UserOwnAppDoc> {
        return await db.user_own_apps.getOrCreateFor(userID, this)
      },

      async getUserAppSettings(userID: string): Promise<UserAppSettingsDoc> {
        const userOwnApp = await this.getUserOwnApp(userID)
        return await userOwnApp.populate('settings')
      },

      async addVersion(data: { version: string }): Promise<void> {
        await this.atomicUpdate(doc => {
          const current = doc.versions[0]
          if (semver.gte(current.version, data.version)) {
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

      async publishVersion(bzz: Bzz): Promise<string> {
        const toPublish = this.getInProgressVersion()
        if (toPublish == null) {
          throw new Error('Version not found')
        }

        const developer = await this.populate('developer')
        if (developer == null) {
          throw new Error('Developer not found')
        }

        let { contentsHash } = toPublish
        if (contentsHash == null) {
          contentsHash = await bzz.uploadDirectoryFrom(this.contentsPath)
          await this.atomicUpdate(doc => {
            const version = doc.versions.find(
              v => v.version === toPublish.version,
            )
            if (version != null) {
              version.contentsHash = contentsHash
            }
            return doc
          })
        }

        const authorAddress = developer.getAddress()
        const manifest: AppManifestData = {
          authorAddress,
          contentsHash,
          profile: this.profile,
          version: toPublish.version,
          permissions: toPublish.permissions,
        }

        const chapter = await this.getTimeline(bzz).addChapter({
          author: authorAddress,
          content: manifest,
        })
        await this.atomicUpdate(doc => {
          const version = doc.versions.find(
            v => v.version === toPublish.version,
          )
          if (version != null) {
            version.versionHash = chapter.id
          }
          return doc
        })

        return chapter.id
      },
    },
  })
}
