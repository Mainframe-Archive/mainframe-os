// @flow

import type {
  WebRequestDefinition,
  WebRequestGrant,
  PermissionCheckResult,
  PermissionKey,
  PermissionsDefinitions,
  StrictPermissionsDefinitions,
  PermissionsDefinitionsDifference,
  PermissionsDetails,
  PermissionsGrants,
  PermissionsRequirements,
  PermissionsRequirementsDifference,
} from './types'

export * from './schema'
export * from './types'

export const EMPTY_DEFINITIONS: PermissionsDefinitions = { WEB_REQUEST: [] }

export const createWebRequestGrant = (
  granted?: WebRequestDefinition = [],
  denied?: WebRequestDefinition = [],
): WebRequestGrant => ({ granted, denied })

export const createDefinitions = (
  definitions?: PermissionsDefinitions = {},
): StrictPermissionsDefinitions => ({
  ...definitions,
  WEB_REQUEST: Array.isArray(definitions.WEB_REQUEST)
    ? definitions.WEB_REQUEST
    : [],
})

export const createRequirements = (
  required?: PermissionsDefinitions,
  optional?: PermissionsDefinitions,
): PermissionsRequirements => ({
  required: createDefinitions(required),
  optional: createDefinitions(optional),
})

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
    WEB_REQUEST: {
      granted: app.WEB_REQUEST.granted.concat(user.WEB_REQUEST.granted),
      denied: [...user.WEB_REQUEST.denied],
    },
  },
})

export const checkPermission = (
  permissions: PermissionsGrants,
  key: PermissionKey,
  input?: ?string,
): PermissionCheckResult => {
  switch (key) {
    case 'WEB_REQUEST':
      if (input == null) {
        return 'invalid_input'
      }
      if (permissions.WEB_REQUEST.granted.includes(input)) {
        return 'granted'
      }
      if (permissions.WEB_REQUEST.denied.includes(input)) {
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

  const { WEB_REQUEST: currHR, ...currOthers } = current
  const { WEB_REQUEST: nextHR, ...nextOthers } = next

  const emptyCurrHR = currHR == null || currHR.length === 0
  const emptyNextHR = nextHR == null || nextHR.length === 0

  if (emptyCurrHR) {
    if (emptyNextHR) {
      unchanged.WEB_REQUEST = []
    } else {
      added.WEB_REQUEST = nextHR
    }
  } else if (emptyNextHR) {
    removed.WEB_REQUEST = currHR
  } else if (
    currHR != null &&
    nextHR != null &&
    nextHR.length === currHR.length
  ) {
    // Same length, need to compare values
    const currStable = [...currHR].sort().toString()
    const nextStable = [...nextHR].sort().toString()
    if (nextStable === currStable) {
      unchanged.WEB_REQUEST = currHR
    } else {
      changed.WEB_REQUEST = nextHR
    }
  } else {
    // Different length -> changed
    changed.WEB_REQUEST = nextHR
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
