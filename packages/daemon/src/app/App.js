// @flow

import { verifyManifest, type ManifestData } from '@mainframe/app-manifest'
import {
  createWebRequestGrant,
  havePermissionsToGrant,
  mergeGrantsToDetails,
  PERMISSION_KEYS_BOOLEAN,
  type StrictPermissionsGrants,
} from '@mainframe/app-permissions'
import type { AppInstallationState } from '@mainframe/client'
import { MFID } from '@mainframe/data-types'
import type { SignedContents } from '@mainframe/secure-file'
import { uniqueID, type ID } from '@mainframe/utils-id'

import type { bzzHash } from '../swarm/feed'
import AbstractApp, {
  type AbstractAppParams,
  type SessionData,
} from './AbstractApp'
import Session from './Session'

export type AppParams = AbstractAppParams & {
  manifest: ManifestData,
  installationState: AppInstallationState,
}

export type AppSerialized = AppParams

export type AppUpdateData = { manifest: SignedContents }

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

  get mfid(): string {
    return this._manifest.id
  }

  get version(): string {
    return this._manifest.version
  }

  get updateFeedHash(): bzzHash {
    return this._manifest.updateHash
  }

  getPermissionsChecked(userID: ID): boolean {
    if (!havePermissionsToGrant(this._manifest.permissions)) {
      return true
    }
    return this.getSettings(userID).permissionsSettings.permissionsChecked
  }

  // Updates

  verifyManifest(contents: SignedContents): ManifestData {
    return verifyManifest(contents, [
      MFID.from(this.mfid).data.toBuffer(),
      MFID.from(this.manifest.author.id).data.toBuffer(),
    ])
  }

  applyUpdate(
    manifest: ManifestData,
    installationState?: AppInstallationState = 'pending',
  ): void {
    this._manifest = manifest
    this._installationState = installationState
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
    const userPermissions: StrictPermissionsGrants = this.getPermissions(
      userID,
    ) || {
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
      storage: this.getSettings(userID).storageSettings,
    }
  }
}
