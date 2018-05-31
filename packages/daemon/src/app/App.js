// @flow

// eslint-disable-next-line import/named
import { idType, uniqueID, type ID } from '@mainframe/utils-id'

import type { MFID } from '../utils'

import Session from './Session'

// TODO: add others
type PermissionKeySimple = 'WEB3_CALL' | 'WEB3_SEND'
export type PermissionKey = 'HTTPS_REQUEST' | PermissionKeySimple

export type PermissionsDefinitions = {
  HTTPS_REQUEST: Array<string>,
  [PermissionKeySimple]: boolean,
}

export type PermissionsGrants = {
  HTTPS_REQUEST: {
    granted: Array<string>,
    denied: Array<string>,
  },
  [PermissionKeySimple]: boolean,
}

export type PermissionGrant = $Values<PermissionsGrants>

export type PermissionRequirement = 'required' | 'optional'

export type PermissionLifetime =
  | 'app' // As long as the app is installed
  | 'user' // As long as the user allows
  | 'session' // As long as the app is running

export type PermissionRequirements = {
  [PermissionRequirement]: PermissionsDefinitions,
}

export type PermissionsDetails = { [PermissionLifetime]: PermissionsGrants }

export type AppManifest = {
  id: MFID,
  name: string,
  permissions: PermissionRequirements,
}

export type SessionData = {
  sessID: ID,
  session: Session,
  permissions: PermissionsDetails,
}

export type AppInstallationState =
  | 'manifest-pending'
  | 'manifest-downloading'
  | 'manifest-invalid-signature'
  | 'manifest-invalid-schema'
  | 'confirmation-pending'
  | 'package-lookup'
  | 'package-invalid-hash'
  | 'package-download-started'
  | 'package-download-failed'
  | 'package-download-done'
  | 'package-invalid-signature'
  | 'ready'

export type AppUserSettings = {
  permissions: PermissionsGrants,
}

export type AppParams = {
  appID: ID,
  manifest: AppManifest,
  installationState: AppInstallationState,
  settings?: { [ID]: AppUserSettings },
}

export type AppSerialized = AppParams

export default class App {
  static fromJSON = (params: AppSerialized): App => new App(params)

  static toJSON = (app: App): AppSerialized => ({
    appID: app._appID,
    manifest: app._manifest,
    installationState: app._installationState,
    settings: app._settings,
  })

  _appID: ID
  _manifest: AppManifest
  _installationState: AppInstallationState
  _settings: { [ID]: AppUserSettings }

  constructor(params: AppParams) {
    this._appID = params.appID
    this._manifest = params.manifest
    this._installationState = params.installationState
    this._settings = params.settings == null ? {} : params.settings
  }

  get id(): ID {
    return this._appID
  }

  get manifest(): AppManifest {
    return this._manifest
  }

  get users(): Array<ID> {
    return Object.keys(this._settings).map(idType)
  }

  getSettings(userID: ID): AppUserSettings {
    return this._settings[userID] || { permissions: {} }
  }

  setSettings(userID: ID, settings: AppUserSettings): void {
    this._settings[userID] = settings
  }

  getPermissions(userID: ID): ?PermissionsGrants {
    const settings = this._settings[userID]
    if (settings != null && settings.permissions != null) {
      return settings.permissions
    }
  }

  setPermissions(userID: ID, permissions: PermissionsGrants): void {
    const settings = this.getSettings(userID)
    settings.permissions = permissions
    this._settings[userID] = settings
  }

  getPermission(userID: ID, key: PermissionKey): ?PermissionGrant {
    const permissions = this.getPermissions(userID)
    if (permissions != null) {
      return permissions[key]
    }
  }

  setPermission(userID: ID, key: PermissionKey, value: PermissionGrant): void {
    const { permissions } = this.getSettings(userID)
    if (
      (key === 'HTTPS_REQUEST' && typeof value === 'object') ||
      (key !== 'HTTPS_REQUEST' && typeof value === 'boolean')
    ) {
      // $FlowFixMe: value polymorphism
      permissions[key] = value
      this.setPermissions(userID, permissions)
    }
  }

  removeUser(userID: ID) {
    delete this._settings[userID]
  }

  createSession(userID: ID): SessionData {
    const appRequired = this.manifest.permissions.required || {}
    const appRequest = {
      granted: appRequired.HTTPS_REQUEST || [],
      denied: [],
    }

    const userPermissions = this.getPermissions(userID) || {}
    const userRequest = userPermissions.HTTPS_REQUEST || {
      granted: [],
      denied: [],
    }

    // These permissions details will be provided to the client
    const permissions: PermissionsDetails = {
      app: {
        ...appRequired,
        HTTPS_REQUEST: appRequest,
      },
      user: {
        ...userPermissions,
        HTTPS_REQUEST: userRequest,
      },
      session: {
        HTTPS_REQUEST: appRequest,
      },
    }

    const sessionPermissions = {
      ...permissions.user, // User configuration
      ...permissions.app, // Manifest requirements overrides
      // Special case
      HTTPS_REQUEST: {
        granted: appRequest.granted.concat(userRequest.granted),
        denied: [...userRequest.denied],
      },
    }

    return {
      sessID: uniqueID(),
      session: new Session(this._appID, userID, sessionPermissions),
      permissions,
      // TODO: add path to app assets
    }
  }
}
