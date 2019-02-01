// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  AppCheckPermissionParams,
  AppCheckPermissionResult,
  AppCloseParams,
  AppCreateParams,
  AppCreateResult,
  AppGetAllResult,
  AppGetManifestDataParams,
  AppGetManifestDataResult,
  AppInstallParams,
  AppInstallResult,
  AppLoadManifestParams,
  AppLoadManifestResult,
  AppOpenParams,
  AppOpenResult,
  AppPublishParams,
  AppPublishResult,
  AppRemoveParams,
  AppSetPermissionParams,
  AppSetPermissionsRequirementsParams,
  AppSetUserPermissionsSettingsParams,
  AppSetUserSettingsParams,
} from '../types'

export default class AppAPIs extends ClientAPIs {
  checkPermission(
    params: AppCheckPermissionParams,
  ): Promise<AppCheckPermissionResult> {
    return this._rpc.request('app_checkPermission', params)
  }

  close(params: AppCloseParams): Promise<void> {
    return this._rpc.request('app_close', params)
  }

  create(params: AppCreateParams): Promise<AppCreateResult> {
    return this._rpc.request('app_create', params)
  }

  getAll(): Promise<AppGetAllResult> {
    return this._rpc.request('app_getAll')
  }

  getManifestData(
    params: AppGetManifestDataParams,
  ): Promise<AppGetManifestDataResult> {
    return this._rpc.request('app_getManifestData', params)
  }

  install(params: AppInstallParams): Promise<AppInstallResult> {
    return this._rpc.request('app_install', params)
  }

  loadManifest(params: AppLoadManifestParams): Promise<AppLoadManifestResult> {
    return this._rpc.request('app_loadManifest', params)
  }

  open(params: AppOpenParams): Promise<AppOpenResult> {
    return this._rpc.request('app_open', params)
  }

  publish(params: AppPublishParams): Promise<AppPublishResult> {
    return this._rpc.request('app_publish', params)
  }

  remove(params: AppRemoveParams): Promise<void> {
    return this._rpc.request('app_remove', params)
  }

  setUserSettings(params: AppSetUserSettingsParams): Promise<void> {
    return this._rpc.request('app_setUserSettings', params)
  }

  setUserPermissionsSettings(
    params: AppSetUserPermissionsSettingsParams,
  ): Promise<void> {
    return this._rpc.request('app_setUserPermissionsSettings', params)
  }

  setPermission(params: AppSetPermissionParams): Promise<void> {
    return this._rpc.request('app_setPermission', params)
  }

  setPermissionsRequirements(
    params: AppSetPermissionsRequirementsParams,
  ): Promise<void> {
    return this._rpc.request('app_setPermissionsRequirements', params)
  }
}
