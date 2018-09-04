// @flow

import type { ManifestData } from '@mainframe/app-manifest'
import {
  createWebRequestGrant,
  mergeGrantsToDetails,
  PERMISSION_KEYS_BOOLEAN,
  type PermissionsGrants,
} from '@mainframe/app-permissions'
// eslint-disable-next-line import/named
import { uniqueID, type ID } from '@mainframe/utils-id'

import AbstractApp, {
  type AbstractAppParams,
  type SessionData,
} from './AbstractApp'
import Session from './Session'

export type AppInstallationState =
  | 'pending'
  | 'hash_lookup'
  | 'hash_not_found'
  | 'downloading'
  | 'download_error'
  | 'ready'

export type AppParams = AbstractAppParams & {
  manifest: ManifestData,
  installationState: AppInstallationState,
}

export type AppSerialized = AppParams

export default class App extends AbstractApp {
  static fromJSON = (params: AppSerialized): App => new App(params)

  // $FlowFixMe: App type
  static toJSON = (app: App): AppSerialized => ({
    appID: app._appID,
    installationState: app._installationState,
    manifest: app._manifest,
    settings: app._settings,
  })

  _installationState: AppInstallationState
  _manifest: ManifestData

  constructor(params: AppParams) {
    super(params)
    this._installationState = params.installationState
    this._manifest = params.manifest
  }

  // Accessors

  get installationState(): AppInstallationState {
    return this._installationState
  }

  set installationState(value: AppInstallationState): void {
    this._installationState = value
  }

  get manifest(): ManifestData {
    return this._manifest
  }

  // Session

  createSession(userID: ID): SessionData {
    if (!this.getPermissionsChecked(userID)) {
      throw new Error('Permissions need to be checked by user')
    }

    const requiredPermissions = this.manifest.permissions.required
    const allManifestPermissions = {
      ...this.manifest.permissions.required,
      ...this.manifest.permissions.optional,
    }

    const appPermissions = {
      ...requiredPermissions,
      WEB_REQUEST: createWebRequestGrant(requiredPermissions.WEB_REQUEST),
    }
    const userPermissions: PermissionsGrants = this.getPermissions(userID) || {
      WEB_REQUEST: createWebRequestGrant(),
    }

    PERMISSION_KEYS_BOOLEAN.forEach(key => {
      // Any keys not present in the manifest we set to false (deny)
      if (!allManifestPermissions[key]) {
        userPermissions[key] = false
      }
    })
    const permissions = mergeGrantsToDetails(appPermissions, userPermissions)
    const session = new Session(this._appID, userID, permissions.session)
    return {
      permissions,
      sessID: uniqueID(),
      session,
    }
  }
}
