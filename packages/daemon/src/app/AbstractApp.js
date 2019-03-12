// @flow

import { createKeyPair } from '@erebos/secp256k1'
import {
  createStrictPermissionGrants,
  type PermissionGrant,
  type PermissionKey,
  type PermissionsDetails,
  type PermissionsGrants,
  type StrictPermissionsGrants,
} from '@mainframe/app-permissions'
import { encodeBase64 } from '@mainframe/utils-base64'
import { createSecretStreamKey } from '@mainframe/utils-crypto'
// eslint-disable-next-line import/named
import type {
  AppUserPermissionsSettings,
  AppUserSettings,
  StorageSettings,
} from '@mainframe/client'
import { idType, type ID, uniqueID } from '@mainframe/utils-id'

import type Session from './Session'

const DEFAULT_SETTINGS = {
  permissionsSettings: {
    grants: {
      WEB_REQUEST: {
        denied: [],
        granted: [],
      },
    },
    permissionsChecked: false,
  },
  walletSettings: {
    defaultEthAccount: null,
  },
  approvedContacts: {},
}

export type WalletSettings = {
  defaultEthAccount: ?string,
}

export type SessionData = {
  sessID: ID,
  session: Session,
  permissions: PermissionsDetails,
  isDev?: ?boolean,
  storage: StorageSettings,
}

export type ContactToApprove = {
  localID: string,
  publicDataOnly: boolean,
}

export type ApprovedContact = {
  id: string,
  localID: string,
  publicDataOnly: boolean,
}

export type AbstractAppParams = {
  appID: ID,
  settings?: { [ID]: AppUserSettings },
  storage?: StorageSettings,
}

export type AbstractAppSerialized = AbstractAppParams

export const createAppStorage = (): StorageSettings => {
  const kp = createKeyPair()
  return {
    feedHash: undefined,
    feedKey: kp.getPrivate('hex'),
    encryptionKey: encodeBase64(createSecretStreamKey()),
  }
}

export default class AbstractApp {
  static toJSON = (app: AbstractApp): AbstractAppSerialized => ({
    appID: app._appID,
    settings: app._settings,
  })

  _appID: ID
  _settings: { [ID]: AppUserSettings }

  constructor(params: AbstractAppParams) {
    this._appID = params.appID
    this._settings = params.settings == null ? {} : params.settings
  }

  // Accessors

  get id(): ID {
    return this._appID
  }

  get settings(): { [ID]: AppUserSettings } {
    return this._settings
  }

  get userIDs(): Array<ID> {
    return Object.keys(this._settings).map(idType)
  }

  removeUser(userID: ID) {
    delete this._settings[userID]
  }

  // Settings

  getDefaultSettings(): AppUserSettings {
    return { ...DEFAULT_SETTINGS, storageSettings: createAppStorage() }
  }

  getSettings(userID: ID | string): AppUserSettings {
    return (
      this._settings[idType(userID)] ||
      JSON.parse(JSON.stringify(this.getDefaultSettings()))
    )
  }

  setSettings(userID: ID, settings: AppUserSettings): void {
    settings.permissionsSettings.grants = createStrictPermissionGrants(
      settings.permissionsSettings.grants,
    )
    this._settings[userID] = settings
  }

  getPermissions(userID: ID): StrictPermissionsGrants {
    return this.getSettings(userID).permissionsSettings.grants
  }

  setPermissions(
    userID: ID,
    permissions: PermissionsGrants | StrictPermissionsGrants,
  ): void {
    const settings = this.getSettings(userID)
    settings.permissionsSettings.grants = createStrictPermissionGrants(
      permissions,
    )
    this._settings[userID] = settings
  }

  setPermissionsSettings(
    userID: ID,
    settings: AppUserPermissionsSettings,
  ): void {
    const appSettings = this.getSettings(userID)
    appSettings.permissionsSettings.grants = createStrictPermissionGrants(
      settings.grants,
    )
    appSettings.permissionsSettings.permissionsChecked =
      settings.permissionsChecked
    this._settings[userID] = appSettings
  }

  getPermission(userID: ID, key: PermissionKey): ?PermissionGrant {
    const permissions = this.getPermissions(userID)
    if (permissions != null) {
      return permissions[key]
    }
  }

  setPermission(userID: ID, key: PermissionKey, value: PermissionGrant): void {
    const { permissionsSettings } = this.getSettings(userID)
    if (
      (key === 'WEB_REQUEST' && typeof value === 'object') ||
      (key !== 'WEB_REQUEST' && typeof value === 'boolean')
    ) {
      // $FlowFixMe: value polymorphism
      permissionsSettings.grants[key] = value
      this.setPermissions(userID, permissionsSettings.grants)
    }
  }

  setPermissionsChecked(userID: ID, checked: boolean) {
    const settings = this.getSettings(userID)
    settings.permissionsSettings.permissionsChecked = checked
    this._settings[userID] = settings
  }

  setFeedHash(userID: ID, feedHash: string): void {
    const settings = this.getSettings(userID)
    settings.storageSettings.feedHash = feedHash
    this._settings[userID] = settings
  }

  setDefaultEthAccount(userID: ID, walletID: ID, account: string) {
    const settings = this.getSettings(userID)
    settings.walletSettings.defaultEthAccount = account
    this._settings[userID] = settings
  }

  getDefaultEthAccount(userID: ID): ?string {
    const settings = this.getSettings(userID)
    if (settings.walletSettings) {
      return settings.walletSettings.defaultEthAccount
    }
  }

  getLocalIDByApprovedID(userID: ID | string, id: string): ?string {
    const found = this.getSettings(userID).approvedContacts[id]
    return found ? found.localID : null
  }

  getApprovedIDByLocalID(userID: ID | string, localID: ?string): ?string {
    const { approvedContacts } = this.getSettings(userID)
    const found = Object.values(approvedContacts).find(
      // $FlowFixMe: Object.values
      c => c.localID === localID,
    )
    // $FlowFixMe: Object.values
    return found ? found.id : null
  }

  getApprovedContacts(userID: ID | string): { [string]: ApprovedContact } {
    const { approvedContacts } = this.getSettings(userID)
    return approvedContacts
  }

  approveContacts(
    userID: ID,
    contacts: Array<ContactToApprove>,
  ): { [string]: ApprovedContact } {
    const settings = this.getSettings(userID)
    const approvedContacts = settings.approvedContacts
    const contactsAdded = {}
    contacts.forEach(c => {
      let id = this.getApprovedIDByLocalID(userID, c.localID)
      if (!id) {
        id = (uniqueID(): string)
        approvedContacts[id] = {
          id,
          localID: c.localID,
          publicDataOnly: c.publicDataOnly,
        }
      }
      contactsAdded[id] = approvedContacts[id]
    })
    this._settings[userID] = settings
    return contactsAdded
  }

  // Session

  createSession(_userID: ID): SessionData {
    throw new Error('Must be implemented')
  }
}
