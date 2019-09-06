// @flow

import type { Bzz } from '@erebos/api-bzz-node'
import { createHex } from '@erebos/hex'
import { createKeyPair, sign, type KeyPair } from '@erebos/secp256k1'
import { pubKeyToAddress } from '@erebos/keccak256'
import { Timeline, createChapter, type PartialChapter } from '@erebos/timeline'
import semver from 'semver'

import { MF_PREFIX } from '../../../constants'

import { validateAppFeed } from '../../data/protocols'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'
import { generateKeyPair, generateLocalID } from '../utils'

import type {
  AppManifestData,
  WebDomainsDefinitions,
} from '../schemas/appManifest'
import schema, {
  type OwnAppData,
  type OwnAppVersionData,
} from '../schemas/ownApp'
import type { GenericProfile } from '../schemas/genericProfile'

import type { AppMetadata } from './apps'
import type { OwnDeveloperDoc } from './ownDevelopers'
import type { UserAppSettingsDoc } from './userAppSettings'
import type { UserOwnAppDoc } from './userOwnApps'

export type CreateOwnAppData = {|
  contentsPath: string,
  developer: string,
  profile: GenericProfile,
  version: string,
  webDomains: WebDomainsDefinitions,
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
  encodeAppVersion(
    chapter: $Shape<PartialChapter<AppMetadata>>,
  ): Promise<string>,
  addVersion(data: { version: string }): Promise<void>,
  setDetails(data: AppDetails): Promise<void>,
  setWebDomains(webDomains: WebDomainsDefinitions): Promise<void>,
  publishVersion(bzz: Bzz): Promise<string>,
|}

export type OwnAppDoc = Doc<
  OwnAppData,
  OwnAppMethods,
  { developer: OwnDeveloperDoc },
>

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
              webDomains: data.webDomains,
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
          encode: this.encodeAppVersion,
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

      async encodeAppVersion(
        chapter: $Shape<PartialChapter<AppMetadata>>,
      ): Promise<string> {
        // Sanity check for developer
        const developer = await this.populate('developer')
        if (developer == null) {
          throw new Error('Developer not found')
        }

        // Inject author and signature into chapter
        chapter.author = developer.getAddress()
        chapter.content.authorKey = developer.keyPair.publicKey
        const signature = sign(
          createHex(chapter).toBytesArray(),
          createKeyPair(developer.keyPair.privateKey),
        )
        chapter.signature = createHex(signature).value

        // Validate it conforms protocol and return serialised chapter
        await validateAppFeed(chapter)
        return JSON.stringify(chapter)
      },

      async addVersion(data: { version: string }): Promise<void> {
        await this.atomicUpdate(doc => {
          const current = doc.versions[0]
          if (semver.gte(current.version, data.version)) {
            throw new Error('New version must be greater than current one')
          }
          doc.versions = [
            { version: data.version, webDomains: current.webDomains },
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

      async setWebDomains(webDomains: WebDomainsDefinitions): Promise<void> {
        await this.atomicUpdate(doc => {
          const version = doc.versions.find(v => v.versionHash == null)
          if (version != null) {
            version.webDomains = webDomains
          }
          return doc
        })
      },

      async publishVersion(bzz: Bzz): Promise<string> {
        const toPublish = this.getInProgressVersion()
        if (toPublish == null) {
          throw new Error('Version not found')
        }

        let { contentsHash } = toPublish
        if (contentsHash == null) {
          // eslint-disable-next-line require-atomic-updates
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

        const manifest: AppManifestData = {
          contentsHash,
          profile: this.profile,
          version: toPublish.version,
          webDomains: toPublish.webDomains,
        }
        // NOTE: Using createChapter() will no longer be needed when calling addChapter() in erebos v0.9
        const chapter = await this.getTimeline(bzz).addChapter(
          createChapter({ content: { manifest } }),
        )
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
