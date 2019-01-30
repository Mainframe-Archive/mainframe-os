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
import { encodeBase64, type base64 } from '@mainframe/utils-base64'
import { secureRandomBytes } from '@mainframe/utils-crypto'
import { idType, type ID } from '@mainframe/utils-id'

import type Session from './Session'

const DEFAULT_SETTINGS = {
  permissionsSettings: {
    grants: {
      WEB_REQUEST: [],
    },
    permissionsChecked: false,
  },
  walletSettings: {
    defaultEthAccount: null,
  },
}

export type AppStorage = {
  feedHash: ?string,
  feedKey: string, // hex
  encryptionKey: base64,
}

export type WalletSettings = {
  defaultEthAccount: ?string,
}

export type SessionData = {
  sessID: ID,
  session: Session,
  permissions: PermissionsDetails,
  isDev?: ?boolean,
  storage: AppStorage,
}

export type PermissionsSettings = {
  grants: StrictPermissionsGrants,
  permissionsChecked: boolean,
}

export type AppUserSettings = {
  permissionsSettings: PermissionsSettings,
  walletSettings: WalletSettings,
  storage: AppStorage,
}

export type AbstractAppParams = {
  appID: ID,
  settings?: { [ID]: AppUserSettings },
  storage?: AppStorage,
}

export type AbstractAppSerialized = AbstractAppParams

export const createAppStorage = (): AppStorage => {
  const kp = createKeyPair()
  return {
    feedHash: undefined,
    feedKey: kp.getPrivate('hex'),
    encryptionKey: encodeBase64(secureRandomBytes(32)),
  }
}

export default class AbstractApp {
  static toJSON = (app: AbstractApp): AbstractAppSerialized => ({
    appID: app._appID,
    settings: app._settings,
    storage: app._storage,
  })

  _appID: ID
  _settings: { [ID]: AppUserSettings }
  _storage: AppStorage

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

  get storage(): AppStorage {
    return this._storage
  }

  get userIDs(): Array<ID> {
    return Object.keys(this._settings).map(idType)
  }

  // Settings

  getDefaultSettings(): AppUserSettings {
    console.log('setFeedHash in packages/daemon/src/app/AbstractApp.js')
    console.log(DEFAULT_SETTINGS, 'DEFAULT_SETTINGS')
    console.log({ ...DEFAULT_SETTINGS, storage: createAppStorage() }, '{ ...DEFAULT_SETTINGS, storage: createAppStorage() }')
    return { ...DEFAULT_SETTINGS, storage: createAppStorage() }
  }

  getSettings(userID: ID): AppUserSettings {
    return this._settings[userID] || this.getDefaultSettings()
  }

  setSettings(userID: ID, settings: AppUserSettings): void {
    settings.permissionsSettings.grants = createStrictPermissionGrants(
      settings.permissionsSettings.grants,
    )
    this._settings[userID] = settings
  }

  getPermissions(userID: ID): ?StrictPermissionsGrants {
    const settings = this._settings[userID]
    if (settings != null && settings.permissionsSettings != null) {
      return settings.permissionsSettings.grants
    }
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

  setPermissionsSettings(userID: ID, settings: PermissionsSettings): void {
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
    console.log('setFeedHash in packages/daemon/src/app/AbstractApp.js')
    const settings = this.getSettings(userID)
    console.log(settings, 'settings')
    console.log('\n')
    this.setFeedHash(userID, feedHash)
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

  removeUser(userID: ID) {
    delete this._settings[userID]
  }

  // Session

  createSession(_userID: ID): SessionData {
    throw new Error('Must be implemented')
  }
}
