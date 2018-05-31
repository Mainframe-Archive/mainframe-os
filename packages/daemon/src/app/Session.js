// @flow

// eslint-disable-next-line import/named
import { type ID } from '@mainframe/utils-id'

import type { PermissionKey, PermissionGrant, PermissionsGrants } from './App'

export type PermissionResult =
  | 'unknown_key'
  | 'not_set'
  | 'invalid_input'
  | 'granted'
  | 'denied'

export default class Session {
  _appID: ID
  _userID: ID
  _permissions: PermissionsGrants

  constructor(appID: ID, userID: ID, permissions: PermissionsGrants) {
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

  checkPermission(key: PermissionKey, input?: ?string): PermissionResult {
    switch (key) {
      case 'HTTPS_REQUEST': {
        if (input == null) {
          return 'invalid_input'
        }
        const domains = this._permissions.HTTPS_REQUEST
        if (domains.granted.includes(input)) {
          return 'granted'
        }
        if (domains.denied.includes(input)) {
          return 'denied'
        }
        return 'not_set'
      }

      case 'WEB3_CALL':
        if (this._permissions[key] == null) {
          return 'not_set'
        }
        return this._permissions[key] === true ? 'granted' : 'denied'

      default:
        return 'unknown_key'
    }
  }

  // $FlowFixMe: value polymorphism
  setPermission(key: PermissionKey, value: PermissionGrant): void {
    this._permissions[key] = value
  }
}
