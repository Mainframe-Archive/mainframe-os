// @flow

import { PERMISSIONS_REQUIREMENTS_SCHEMA } from '@mainframe/app-permissions'
import { isValidMainframeID } from '@mainframe/data-types'
import semver from 'semver'
import { parse as parseURI } from 'uri-js'

export const INVALID_ID_ERROR =
  "The value '{actual}' is not a valid Mainframe ID!"
export const INVALID_SEMVER_ERROR = "The value '{actual}' is not valid semver!"
export const INVALID_URN_ERROR = "The value '{actual}' is not a valid URN!"

export const MANIFEST_SCHEMA_MESSAGES = {
  id: INVALID_ID_ERROR,
  semver: INVALID_SEMVER_ERROR,
  urn: INVALID_URN_ERROR,
}

export const isValidSemver = (value: string): boolean => {
  return semver.valid(value) != null
}

export const isValidURN = (value: string): boolean => {
  const parsed = parseURI(value)
  return parsed.scheme === 'urn' && parsed.error == null
}

export const idCheck = function(value: string) {
  return isValidMainframeID(value) || this.makeError('id', null, value)
}

export const semverCheck = function(value: string) {
  return isValidSemver(value) || this.makeError('semver', null, value)
}

export const urnCheck = function(value: string) {
  return isValidURN(value) || this.makeError('urn', null, value)
}

export const ID_SCHEMA = {
  type: 'custom',
  check: idCheck,
}

export const SEMVER_SCHEMA = {
  type: 'custom',
  check: semverCheck,
}

export const URN_SCHEMA = {
  type: 'custom',
  check: urnCheck,
}

export const NAME_SCHEMA = {
  type: 'string',
  min: 3,
  max: 50,
}

export const MANIFEST_SCHEMA = {
  id: ID_SCHEMA,
  author: {
    type: 'object',
    props: {
      id: ID_SCHEMA,
    },
  },
  name: NAME_SCHEMA,
  version: SEMVER_SCHEMA,
  contentsURI: URN_SCHEMA,
  permissions: PERMISSIONS_REQUIREMENTS_SCHEMA,
}
