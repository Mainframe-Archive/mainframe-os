// @flow

import AppManifest, { type AppManifestSerialized } from './AppManifest'
import { uniqueID, typeID, type ID } from '../utils'

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

export type AppIdentitySettings = {
  permissions: Object,
}

export type AppParams = {
  id?: ID,
  manifest: AppManifest,
  currentIdentity: ID,
  installationState: AppInstallationState,
  settings?: { [id: ID]: AppIdentitySettings },
}

export type AppSerialized = {
  id: string,
  manifest: AppManifestSerialized,
  currentIdentity: string,
  installationState: AppInstallationState,
  settings?: { [id: ID]: AppIdentitySettings },
}

export default class App {
  static hydrate = (params: AppSerialized) => {
    return new App({
      id: typeID(params.id),
      manifest: AppManifest.hydrate(params.manifest),
      currentIdentity: typeID(params.currentIdentity),
      installationState: params.installationState,
      settings: params.settings,
    })
  }

  static serialize = (app: App): AppSerialized => app.serialized()

  _appID: ID
  _manifest: AppManifest
  _currentIdentity: ID
  _installationState: AppInstallationState
  _settings: { [id: ID]: AppIdentitySettings }

  constructor(params: AppParams) {
    this._appID = params.id || uniqueID()
    this._manifest = params.manifest
    this._currentIdentity = params.currentIdentity
    this._installationState = params.installationState
    this._settings = params.settings || {}
  }

  get id(): ID {
    return this._appID
  }

  serialized(): AppSerialized {
    return {
      id: this._appID,
      manifest: this._manifest.serialized(),
      currentIdentity: this._currentIdentity,
      installationState: this._installationState,
      settings: this._settings,
    }
  }
}
