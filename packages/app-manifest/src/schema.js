// @flow

import { PERMISSIONS_REQUIREMENTS_SCHEMA } from '@mainframe/app-permissions'
import { isValidMFID } from '@mainframe/data-types'
import semver from 'semver'

export const INVALID_ID_ERROR =
  "The value '{actual}' is not a valid Mainframe ID!"
export const INVALID_SEMVER_ERROR = "The value '{actual}' is not valid semver!"

export const MANIFEST_SCHEMA_MESSAGES = {
  id: INVALID_ID_ERROR,
  semver: INVALID_SEMVER_ERROR,
}

export const isValidSemver = (value: ?string): boolean => {
  return value != null && semver.valid(value) != null
}

export const idCheck = function(value: string) {
  return isValidMFID(value) || this.makeError('id', null, value)
}

export const semverCheck = function(value: string) {
  return isValidSemver(value) || this.makeError('semver', null, value)
}

export const ID_SCHEMA = {
  type: 'custom',
  check: idCheck,
}

export const SEMVER_SCHEMA = {
  type: 'custom',
  check: semverCheck,
}

export const HASH_SCHEMA = {
  type: 'string',
  pattern: /^[0-9a-f]{64}$/,
}

export const NAME_SCHEMA = {
  type: 'string',
  min: 3,
  max: 50,
}

export const MANIFEST_SCHEMA_PROPS = {
  id: ID_SCHEMA,
  author: {
    type: 'object',
    props: {
      id: ID_SCHEMA,
      name: {
        type: 'string',
        min: 3,
        max: 20,
      },
    },
  },
  name: NAME_SCHEMA,
  version: SEMVER_SCHEMA,
  contentsHash: HASH_SCHEMA,
  updateHash: HASH_SCHEMA,
  permissions: PERMISSIONS_REQUIREMENTS_SCHEMA,
}

export const MANIFEST_SCHEMA = {
  type: 'object',
  props: MANIFEST_SCHEMA_PROPS,
}
