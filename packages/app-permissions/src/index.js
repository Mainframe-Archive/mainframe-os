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
  StrictPermissionsGrants,
  PermissionsRequirementsDifference,
  StrictPermissionsRequirements,
} from './types'

export * from './schema'
export * from './types'

export const EMPTY_DEFINITIONS: StrictPermissionsDefinitions = {
  WEB_REQUEST: [],
}

export const definitionsExist = (
  definitions: StrictPermissionsDefinitions,
): boolean => {
  if (!definitions) {
    return false
  }
  return Object.keys(definitions).length > 1 || !!definitions.WEB_REQUEST.length
}

export const havePermissionsToGrant = (
  requirements: ?StrictPermissionsRequirements,
): boolean => {
  if (!requirements) {
    return false
  }
  return (
    definitionsExist(requirements.optional) ||
    definitionsExist(requirements.required)
  )
}

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
): StrictPermissionsRequirements => ({
  required: createDefinitions(required),
  optional: createDefinitions(optional),
})

export const mergeGrantsToDetails = (
  app: StrictPermissionsGrants,
  user: StrictPermissionsGrants,
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

export const createStrictPermissionGrants = (
  permissions: PermissionsGrants | StrictPermissionsGrants,
): StrictPermissionsGrants => {
  return {
    ...permissions,
    WEB_REQUEST: permissions.WEB_REQUEST || createWebRequestGrant(),
  }
}

export const checkURL = (
  input: ?string,
  allowedProtocols?: Array<string> = ['https:', 'wss:'],
): ?string => {
  if (input == null || input.length === 0) {
    return
  }
  try {
    const url = new URL(input)
    if (allowedProtocols.includes(url.protocol)) {
      return url.host
    }
  } catch (err) {
    // Ignore invalid URL
  }
}

export const checkPermission = (
  permissions: StrictPermissionsGrants,
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

    case 'SWARM_UPLOAD':
    case 'SWARM_DOWNLOAD':
    case 'BLOCKCHAIN_SEND':
      if (permissions[key] == null) {
        return 'not_set'
      }
      return permissions[key] === true ? 'granted' : 'denied'

    default:
      return 'unknown_key'
  }
}

export const getDefinitionsDifference = (
  current?: StrictPermissionsDefinitions = EMPTY_DEFINITIONS,
  next?: StrictPermissionsDefinitions = EMPTY_DEFINITIONS,
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
  current?: StrictPermissionsRequirements = createRequirements(),
  next?: StrictPermissionsRequirements = createRequirements(),
): PermissionsRequirementsDifference => ({
  required: getDefinitionsDifference(current.required, next.required),
  optional: getDefinitionsDifference(current.optional, next.optional),
})
