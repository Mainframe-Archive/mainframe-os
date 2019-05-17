// @flow

import semver from 'semver'

const validateHasPublicKey = (data: Object = {}) => {
  if (data.publicKey == null) {
    throw new Error('Missing public key')
  }
  return data
}

const validatePeer = (data: Object = {}) => {
  validateHasPublicKey(data)
  if (data.profile == null) {
    data.profile = {}
  }
  return data
}

const validateFirstContact = (data: Object = {}) => {
  validateHasPublicKey(data.contact)

  if (data.peer == null || data.peer.publicFeed == null) {
    throw new Error('Missing peer public feed')
  }

  return data
}

export const PROTOCOLS = {
  firstContact_v1: {
    name: 'first-contact',
    read: {
      process: validateFirstContact,
      version: '^1.0.0',
    },
    write: {
      process: validateFirstContact,
      version: '1.0.0',
    },
  },
  peer_v1: {
    name: 'peer',
    read: {
      process: validatePeer,
      version: '^1.0.0',
    },
    write: {
      process: validatePeer,
      version: '1.0.0',
    },
  },
}

export type Protocol = $Keys<typeof PROTOCOLS>
export type Payload = { mainframe: string, version: string, data: any }

export const createWriter = (key: Protocol) => {
  const protocol = PROTOCOLS[key]
  if (protocol == null) {
    throw new Error(`Unsupported protocol: ${key}`)
  }

  return (data: any): Payload => ({
    mainframe: protocol.name,
    version: protocol.write.version,
    data: protocol.write.process(data),
  })
}

export const createReader = (key: Protocol) => {
  const protocol = PROTOCOLS[key]
  if (protocol == null) {
    throw new Error(`Unsupported protocol: ${key}`)
  }

  return (payload: Payload) => {
    if (payload.mainframe !== protocol.name) {
      throw new Error('Unsupported payload')
    }
    if (!semver.valid(payload.version)) {
      throw new Error(`Invalid version: ${payload.version}`)
    }
    if (!semver.satisfies(payload.version, protocol.read.version)) {
      throw new Error(`Unsupported version: ${payload.version}`)
    }
    return protocol.read.process(payload.data)
  }
}

export const readFirstContact = createReader('firstContact_v1')
export const writeFirstContact = createWriter('firstContact_v1')

export const readPeer = createReader('peer_v1')
export const writePeer = createWriter('peer_v1')
