// @flow

import { parse as parseURL } from 'url'

export const INVALID_WEB_HOST_ERROR =
  "The value '{actual}' is not a valid Web host!"

export const PERMISSIONS_SCHEMA_MESSAGES = {
  webHost: INVALID_WEB_HOST_ERROR,
}

export const isValidWebHost = (value: ?string): boolean => {
  if (value == null || value.length === 0) {
    return false
  }
  try {
    return parseURL(`http://${value}`).host === value
  } catch (err) {
    // Likely invalid URL
    return false
  }
}

export const webHostCheck = function(value: string) {
  return isValidWebHost(value) || this.makeError('host', null, value)
}

export const PERMISSION_KEYS_BOOLEAN = [
  'SWARM_DOWNLOAD',
  'SWARM_UPLOAD',
  'BLOCKCHAIN_SEND',
  'CONTACTS_READ',
]

export const PERMISSION_KEYS = [...PERMISSION_KEYS_BOOLEAN, 'WEB_REQUEST']

export const PERMISSION_KEY_SCHEMA = {
  type: 'enum',
  values: PERMISSION_KEYS,
}

export const WEB_HOST_SCHEMA = {
  type: 'custom',
  check: webHostCheck,
}

export const WEB_HOSTS_SCHEMA = {
  type: 'array',
  items: WEB_HOST_SCHEMA,
  optional: true,
}

export const WEB_REQUEST_GRANT_SCHEMA = {
  type: 'object',
  props: {
    granted: WEB_HOSTS_SCHEMA,
    denied: WEB_HOSTS_SCHEMA,
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
        ? WEB_HOSTS_SCHEMA
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
