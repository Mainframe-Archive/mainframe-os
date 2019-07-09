// @flow

import { parse as parseURL } from 'url'
import semver from 'semver'

const APP_ID_RE = /^ma[0-9a-f]{40}$/
const CONTACT_ID_RE = /^mc[0-9a-f]{130}$/
const PEER_ID_RE = /^mp[0-9a-f]{40}$/

export const isValidAppID = (id: ?string): boolean => {
  return id != null && APP_ID_RE.test(id)
}

export const isValidContactID = (id: ?string): boolean => {
  return id != null && CONTACT_ID_RE.test(id)
}

export const isValidPeerID = (id: ?string): boolean => {
  return id != null && PEER_ID_RE.test(id)
}

export const isValidSemver = (value: ?string): boolean => {
  return value != null && semver.valid(value) != null
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
