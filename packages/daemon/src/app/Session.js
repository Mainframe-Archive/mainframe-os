// @flow

import {
  checkPermission,
  type PermissionKey,
  type PermissionGrant,
  type StrictPermissionsGrants,
  type PermissionCheckResult,
} from '@mainframe/app-permissions'
import { type ID } from '@mainframe/utils-id'

export default class Session {
  _appID: ID
  _userID: ID
  _permissions: StrictPermissionsGrants

  constructor(appID: ID, userID: ID, permissions: StrictPermissionsGrants) {
    this._appID = appID
    this._userID = userID
    this._permissions = permissions
  }

  get appID(): ID {
    return this._appID
  }

  get userID(): ID {
    return this._userID
  }

  checkPermission(key: PermissionKey, input?: ?string): PermissionCheckResult {
    return checkPermission(this._permissions, key, input)
  }

  // $FlowFixMe: value polymorphism
  setPermission(key: PermissionKey, value: PermissionGrant): void {
    this._permissions[key] = value
  }
}
