// @flow

import type {
  HTTPSRequestDefinition,
  HTTPSRequestGrant,
  PermissionCheckResult,
  PermissionKey,
  PermissionsDetails,
  PermissionsGrants,
} from './types'

export * from './types'

export const createHTTPSRequestGrant = (
  granted?: HTTPSRequestDefinition = [],
  denied?: HTTPSRequestDefinition = [],
): HTTPSRequestGrant => ({ granted, denied })

export const mergeGrantsToDetails = (
  app: PermissionsGrants,
  user: PermissionsGrants,
): PermissionsDetails => ({
  app,
  user,
  session: {
    ...user, // User configuration
    ...app, // Manifest requirements overrides
    // Special case
    HTTPS_REQUEST: {
      granted: app.HTTPS_REQUEST.granted.concat(user.HTTPS_REQUEST.granted),
      denied: [...user.HTTPS_REQUEST.denied],
    },
  },
})

export const checkPermission = (
  permissions: PermissionsGrants,
  key: PermissionKey,
  input?: ?string,
): PermissionCheckResult => {
  switch (key) {
    case 'HTTPS_REQUEST':
      if (input == null) {
        return 'invalid_input'
      }
      if (permissions.HTTPS_REQUEST.granted.includes(input)) {
        return 'granted'
      }
      if (permissions.HTTPS_REQUEST.denied.includes(input)) {
        return 'denied'
      }
      return 'not_set'

    case 'WEB3_CALL':
      if (permissions[key] == null) {
        return 'not_set'
      }
      return permissions[key] === true ? 'granted' : 'denied'

    default:
      return 'unknown_key'
  }
}
