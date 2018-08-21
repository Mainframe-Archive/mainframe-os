// @flow

export const PERMISSION_KEYS_BOOLEAN = [
  'LOCATION_GET',
  'NOTIFICATION_DISPLAY',
  'SWARM_DOWNLOAD',
  'SWARM_UPLOAD',
  'WEB3_SEND',
]

export const PERMISSION_KEYS = [...PERMISSION_KEYS_BOOLEAN, 'WEB_REQUEST']

export const PERMISSION_KEY_SCHEMA = {
  type: 'enum',
  values: PERMISSION_KEYS,
}

// TODO: better domain validation - possible with custom validator?
export const WEB_DOMAINS_SCHEMA = {
  type: 'array',
  items: 'string',
  optional: true,
}

export const WEB_REQUEST_GRANT_SCHEMA = {
  type: 'object',
  props: {
    granted: WEB_DOMAINS_SCHEMA,
    denied: WEB_DOMAINS_SCHEMA,
  },
}

export const PERMISSION_GRANT_SCHEMA = [
  { type: 'boolean' },
  WEB_REQUEST_GRANT_SCHEMA,
]

export const PERMISSIONS_GRANTS_SCHEMA = {
  type: 'object',
  props: PERMISSION_KEYS.reduce((acc, key) => {
    acc[key] =
      key === 'WEB_REQUEST'
        ? { ...WEB_REQUEST_GRANT_SCHEMA, optional: true }
        : { type: 'boolean', optional: true }
    return acc
  }, {}),
}

export const PERMISSIONS_DEFINITIONS_SCHEMA = {
  type: 'object',
  props: PERMISSION_KEYS.reduce((acc, key) => {
    acc[key] =
      key === 'WEB_REQUEST'
        ? WEB_DOMAINS_SCHEMA
        : { type: 'boolean', optional: true }
    return acc
  }, {}),
}

export const PERMISSIONS_REQUIREMENTS_SCHEMA = {
  type: 'object',
  props: {
    required: PERMISSIONS_DEFINITIONS_SCHEMA,
    optional: PERMISSIONS_DEFINITIONS_SCHEMA,
  },
}
