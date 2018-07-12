// @flow

import type {
  HTTPSRequestDefinition,
  HTTPSRequestGrant,
  PermissionCheckResult,
  PermissionKey,
  PermissionsDefinitions,
  PermissionsDefinitionsDifference,
  PermissionsDetails,
  PermissionsGrants,
  PermissionsRequirements,
  PermissionsRequirementsDifference,
} from './types'

export * from './types'

export const EMPTY_DEFINITIONS: PermissionsDefinitions = { HTTPS_REQUEST: [] }

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

export const getDefinitionsDifference = (
  current?: PermissionsDefinitions = EMPTY_DEFINITIONS,
  next?: PermissionsDefinitions = EMPTY_DEFINITIONS,
): PermissionsDefinitionsDifference => {
  const added = {}
  const changed = {}
  const removed = {}
  const unchanged = {}

  const { HTTPS_REQUEST: currHR, ...currOthers } = current
  const { HTTPS_REQUEST: nextHR, ...nextOthers } = next

  if (currHR.length === 0) {
    if (nextHR.length === 0) {
      unchanged.HTTPS_REQUEST = []
    } else {
      added.HTTPS_REQUEST = nextHR
    }
  } else if (nextHR.length === 0) {
    removed.HTTPS_REQUEST = currHR
  } else if (nextHR.length === currHR.length) {
    // Same length, need to compare values
    const currStable = [...currHR].sort().toString()
    const nextStable = [...nextHR].sort().toString()
    if (nextStable === currStable) {
      unchanged.HTTPS_REQUEST = currHR
    } else {
      changed.HTTPS_REQUEST = nextHR
    }
  } else {
    // Different length -> changed
    changed.HTTPS_REQUEST = nextHR
  }

  Object.keys(currOthers).forEach(key => {
    const currValue = currOthers[key]
    const nextValue = nextOthers[key]
    if (nextValue == null) {
      removed[key] = currValue
    } else if (nextValue === currValue) {
      unchanged[key] = currValue
    } else {
      changed[key] = nextValue
    }
  })

  Object.keys(nextOthers).forEach(key => {
    if (currOthers[key] == null) {
      added[key] = nextOthers[key]
    }
  })

  return { added, changed, removed, unchanged }
}

export const getRequirementsDifference = (
  current?: PermissionsRequirements = {},
  next?: PermissionsRequirements = {},
): PermissionsRequirementsDifference => ({
  required: getDefinitionsDifference(current.required, next.required),
  optional: getDefinitionsDifference(current.optional, next.optional),
})
