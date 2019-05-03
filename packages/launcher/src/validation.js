// @flow

const CONTACT_ID_RE = /^mc[0-9a-f]{40}$/

export const isValidContactID = (id: string): boolean => {
  return id != null && CONTACT_ID_RE.test(id)
}
