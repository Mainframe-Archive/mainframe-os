// @flow

// TODO: add others
export type PermissionKeyBasic = 'WEB3_CALL' | 'WEB3_SEND'
export type PermissionKey = 'HTTPS_REQUEST' | PermissionKeyBasic

export type HTTPSRequestDefinition = Array<string>

export type PermissionsDefinitions = {
  HTTPS_REQUEST: HTTPSRequestDefinition,
  [PermissionKeyBasic]: boolean,
}

export type HTTPSRequestGrant = {
  granted: HTTPSRequestDefinition,
  denied: HTTPSRequestDefinition,
}

export type PermissionsGrants = {
  HTTPS_REQUEST: HTTPSRequestGrant,
  [PermissionKeyBasic]: boolean,
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

export type PermissionCheckResult =
  | 'unknown_key' // Not a valid permission key
  | 'not_set' // Valid key but no value
  | 'invalid_input' // Special for HTTPS_REQUEST: domain not provided
  | 'granted'
  | 'denied'
