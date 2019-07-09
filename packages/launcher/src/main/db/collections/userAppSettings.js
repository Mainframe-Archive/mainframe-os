// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import type { WebDomainDefinition } from '../schemas/appManifest'
import schema, { type UserAppSettingsData } from '../schemas/userAppSettings'
import { generateLocalID } from '../utils'

type UserAppSettingsMethods = {|
  setWebDomainGrant(grant: WebDomainDefinition): Promise<void>,
|}

export type UserAppSettingsDoc = UserAppSettingsData & UserAppSettingsMethods

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
        })
      },
    },
    methods: {
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
