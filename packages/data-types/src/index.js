// @flow

import multibase from 'multibase'
import { parse as parseURI } from 'uri-js'

export const MAINFRAME_ID_URN_NID = 'ed25519-pub-multibase'
export const MAINFRAME_ID_URN_NSS_ENCODING = 'base64url'

// Ed25519 public key encoded as base64url in URN
export opaque type MainframeID: string = string

export const mainframeIDType = (value: any): MainframeID => (value: MainframeID)

export const parseMainframeID = (value: string): false | Object => {
  if (value == null) {
    return false
  }
  const parsed = parseURI(value)
  return parsed.error == null &&
    parsed.scheme === 'urn' &&
    parsed.nid === MAINFRAME_ID_URN_NID &&
    multibase.isEncoded(parsed.nss) === MAINFRAME_ID_URN_NSS_ENCODING
    ? parsed
    : false
}

export const isValidMainframeID = (value: string): boolean => {
  return parseMainframeID(value) !== false
}

export const encodeMainframeID = (pubKey: Buffer): MainframeID => {
  const encoded = multibase.encode(MAINFRAME_ID_URN_NSS_ENCODING, pubKey)
  return mainframeIDType(`urn:${MAINFRAME_ID_URN_NID}:${encoded.toString()}`)
}

export const decodeMainframeID = (value: MainframeID): Buffer => {
  const parsed = parseMainframeID(value)
  if (parsed === false) {
    throw new Error('Invalid manifest ID')
  } else {
    return multibase.decode(parsed.nss)
  }
}
