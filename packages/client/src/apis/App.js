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
  AppOpenParams,
  AppOpenResult,
  AppPublishContentsParams,
  AppPublishContentsResult,
  AppRemoveParams,
  AppSetPermissionParams,
  AppSetPermissionsRequirementsParams,
  AppSetUserPermissionsSettingsParams,
  AppSetUserSettingsParams,
  AppWriteManifestParams,
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

  open(params: AppOpenParams): Promise<AppOpenResult> {
    return this._rpc.request('app_open', params)
  }

  publishContents(
    params: AppPublishContentsParams,
  ): Promise<AppPublishContentsResult> {
    return this._rpc.request('app_publishContents', params)
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

  writeManifest(params: AppWriteManifestParams): Promise<void> {
    return this._rpc.request('app_writeManifest', params)
  }
}
