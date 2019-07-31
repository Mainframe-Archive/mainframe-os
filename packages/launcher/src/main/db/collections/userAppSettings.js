// @flow

import { createSecretStreamKey } from '@mainframe/utils-crypto'

import OwnFeed from '../../swarm/OwnFeed'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'

import type { WebDomainDefinition } from '../schemas/appManifest'
import schema, { type UserAppSettingsData } from '../schemas/userAppSettings'
import { generateKeyPair, generateLocalID } from '../utils'

type UserAppSettingsMethods = {|
  getStorageFeed(): OwnFeed,
  getStorageKey(): Buffer,
  setWebDomainGrant(grant: WebDomainDefinition): Promise<void>,
|}

export type UserAppSettingsDoc = Doc<
  UserAppSettingsData,
  UserAppSettingsMethods,
>

type UserAppSettingsStatics = {|
  create(data: $Shape<UserAppSettingsData>): Promise<UserAppSettingsDoc>,
|}

export type UserAppSettingsCollection = Collection<UserAppSettingsData> &
  UserAppSettingsStatics

export default async (
  params: CollectionParams,
): Promise<UserAppSettingsCollection> => {
  return await params.db.collection<
    UserAppSettingsData,
    UserAppSettingsDoc,
    UserAppSettingsMethods,
    UserAppSettingsStatics,
  >({
    name: COLLECTION_NAMES.USER_APP_SETTINGS,
    schema,
    statics: {
      async create(
        data: $Shape<UserAppSettingsData>,
      ): Promise<UserAppSettingsDoc> {
        return await this.insert({
          ...data,
          localID: generateLocalID(),
          storageKeyPair: generateKeyPair(),
          storageEncryptionKey: createSecretStreamKey().toString('base64'),
        })
      },
    },
    methods: {
      getStorageFeed(): OwnFeed {
        if (this._storageFeed == null) {
          this._storageFeed = new OwnFeed(this.storageKeyPair.privateKey)
        }
        return this._storageFeed
      },

      getStorageKey(): Buffer {
        return Buffer.from(this.storageEncryptionKey, 'base64')
      },

      async setWebDomainGrant(grant: WebDomainDefinition): Promise<void> {
        await this.atomicUpdate(doc => {
          const index = doc.webDomains.findIndex(w => w.domain === grant.domain)
          if (index === -1) {
            doc.webDomains.push(grant)
          } else {
            Object.assign(doc.webDomains[index], grant)
          }
          return doc
        })
      },
    },
  })
}
