// @flow

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams } from '../types'

import type { StrictPermissionsGrants } from '../schemas/appPermissionsGrants'
import type { PermissionsRequirementsData } from '../schemas/appPermissionsRequirements'
import schema, { type UserAppSettingsData } from '../schemas/userAppSettings'
import { generateLocalID } from '../utils'

type UserAppSettingsMethods = {|
  getPermissions(): StrictPermissionsGrants,
  setWebRequestPermission(
    permission: 'denied' | 'granted',
    domain: string,
  ): Promise<void>,
|}

export type UserAppSettingsDoc = UserAppSettingsData & UserAppSettingsMethods

type UserAppSettingsStatics = {|
  createFromPermissionRequirement(
    requirements: PermissionsRequirementsData,
  ): Promise<UserAppSettingsDoc>,
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
      async createFromPermissionRequirement(
        requirements: PermissionsRequirementsData,
      ): Promise<UserAppSettingsDoc> {
        const required = requirements.required || {}
        return await this.insert({
          localID: generateLocalID(),
          permissionsGrants: {
            CONTACT_COMMUNICATION: required.CONTACT_COMMUNICATION,
            CONTACT_LIST: required.CONTACT_LIST,
            ETHEREUM_TRANSACTION: required.ETHEREUM_TRANSACTION,
            WEB_REQUEST: {
              granted: required.WEB_REQUEST || [],
              denied: [],
            },
          },
        })
      },
    },
    methods: {
      getPermissions(): StrictPermissionsGrants {
        const webRequest = this.permissions.WEB_REQUEST || {}
        if (webRequest.denied == null) {
          webRequest.denied = []
        }
        if (webRequest.granted == null) {
          webRequest.granted = []
        }
        return {
          CONTACT_COMMUNICATION:
            this.permissions.CONTACT_COMMUNICATION || false,
          CONTACT_LIST: this.permissions.CONTACT_LIST || false,
          ETHEREUM_TRANSACTION: this.permissions.ETHEREUM_TRANSACTION || false,
          WEB_REQUEST: webRequest,
        }
      },

      async setWebRequestPermission(
        permission: 'denied' | 'granted',
        domain: string,
      ): Promise<void> {
        await this.atomicUpdate(doc => {
          // Ensure permissions grants exist
          const permissionsGrants = doc.permissionsGrants || {}
          if (permissionsGrants.denied == null) {
            permissionsGrants.denied = []
          }
          if (permissionsGrants.granted == null) {
            permissionsGrants.granted = []
          }

          // Remove from other list if needed
          const other = permission === 'granted' ? 'denied' : 'granted'
          const otherIndex = permissionsGrants[other].indexOf(domain)
          if (otherIndex !== -1) {
            permissionsGrants[other].splice(otherIndex, 1)
          }

          // Add to permission list
          if (!permissionsGrants[permission].includes(domain)) {
            permissionsGrants[permission].push(domain)
          }

          return doc
        })
      },
    },
  })
}
