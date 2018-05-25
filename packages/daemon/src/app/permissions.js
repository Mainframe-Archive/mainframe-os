// @flow

type PermissionArray = 'HTTPS_REQUEST'
type PermissionBoolean = 'WEB3_CALL' | 'WEB3_SEND'
type PermissionKey = PermissionArray | PermissionBoolean

type PermissionsDefinitions = {
  HTTPS_REQUEST: Array<string>,
  [PermissionBoolean]: boolean,
}

type PermissionsGrants = {
  HTTPS_REQUEST: {
    granted?: Array<string>,
    denied?: Array<string>,
  },
  [PermissionBoolean]: boolean,
}

type PermissionRequirement = 'required' | 'optional'

type PermissionLifetime =
  | 'app' // As long as the app is installed
  | 'user' // As long as the user allows
  | 'session' // As long as the app is running

type PermissionRequirements = {
  [PermissionRequirement]: PermissionsDefinitions,
}

type PermissionsDetails = { [PermissionLifetime]: PermissionsGrants }

// Manifest
type ManifestPermissions = PermissionRequirements

// Persisted app-user data
type AppUserPermissions = PermissionsGrants

// Session (runtime in daemon)
type SessionPermissions = PermissionsGrants

// Provided to client
type AppSessionPermissions = PermissionsDetails
