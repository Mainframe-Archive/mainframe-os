// @flow

const CONTACT_ID_RE = /^mc[0-9a-f]{130}$/
const PEER_ID_RE = /^mp[0-9a-f]{40}$/

export const isValidContactID = (id: string): boolean => {
  return id != null && CONTACT_ID_RE.test(id)
}

export const isValidPeerID = (id: string): boolean => {
  return id != null && PEER_ID_RE.test(id)
}
