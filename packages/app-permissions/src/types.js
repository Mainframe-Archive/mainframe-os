// @flow

export type PermissionKeyBasic =
  | 'LOCATION_GET'
  | 'NOTIFICATION_DISPLAY'
  | 'SWARM_DOWNLOAD'
  | 'SWARM_UPLOAD'
  | 'WEB3_CALL'
  | 'WEB3_SEND'
export type PermissionKey = 'WEB_REQUEST' | PermissionKeyBasic

export type WebRequestDefinition = Array<string>

export type PermissionsDefinitions = {
  WEB_REQUEST: WebRequestDefinition,
  [PermissionKeyBasic]: boolean,
}

export type PartialPermissionsDefinitions = {
  WEB_REQUEST?: WebRequestDefinition,
  [PermissionKeyBasic]: boolean,
}

export type PermissionsDefinitionsDifference = {
  added: PartialPermissionsDefinitions,
  changed: PartialPermissionsDefinitions,
  removed: PartialPermissionsDefinitions,
  unchanged: PartialPermissionsDefinitions,
}

export type WebRequestGrant = {
  granted: WebRequestDefinition,
  denied: WebRequestDefinition,
}

export type PermissionsGrants = {
  WEB_REQUEST: WebRequestGrant,
  [PermissionKeyBasic]: boolean,
}

export type PermissionGrant = $Values<PermissionsGrants>

export type PermissionRequirement = 'required' | 'optional'

export type PermissionLifetime =
  | 'app' // As long as the app is installed
  | 'user' // As long as the user allows
  | 'session' // As long as the app is running

export type PermissionsRequirements = {
  [PermissionRequirement]: PermissionsDefinitions,
}

export type PermissionsRequirementsDifference = {
  [PermissionRequirement]: PermissionsDefinitionsDifference,
}

export type PermissionsDetails = { [PermissionLifetime]: PermissionsGrants }

export type PermissionCheckResult =
  | 'unknown_key' // Not a valid permission key
  | 'not_set' // Valid key but no value
  | 'invalid_input' // Special for WEB_REQUEST: domain not provided
  | 'granted'
  | 'denied'
