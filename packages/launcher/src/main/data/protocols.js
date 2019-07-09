// @flow

import Ajv from 'ajv'
import semver from 'semver'

import { APP_MANIFEST_V0 } from './constants'
import { appManifestSchema } from './schemas/app'

const ajv = new Ajv()
ajv.addSchema([appManifestSchema])

const validateSchema = async (type: string, data: Object) => {
  await ajv.validate(type, data)
  return data
}

const validateHasPublicKey = (data: Object = {}) => {
  if (data.publicKey == null) {
    throw new Error('Missing public key')
  }
  return data
}

const validateAppManifest = async (data: Object = {}) => {
  return await validateSchema(APP_MANIFEST_V0, data)
}

const validateDeveloper = async (data: Object = {}) => {
  if (data.apps == null) {
    data.apps = []
  }
  if (data.profile == null) {
    data.profile = {}
  }
  return data
}

const validatePeer = async (data: Object = {}) => {
  validateHasPublicKey(data)
  if (data.profile == null) {
    data.profile = {}
  }
  return data
}

const validateFirstContact = async (data: Object = {}) => {
  validateHasPublicKey(data.contact)

  if (data.peer == null || data.peer.publicFeed == null) {
    throw new Error('Missing peer public feed')
  }

  return data
}

export const PROTOCOLS = {
  appManifest_v1: {
    name: 'appManifest',
    read: {
      process: validateAppManifest,
      version: '^1.0.0',
    },
    write: {
      process: validateAppManifest,
      version: '1.0.0',
    },
  },
  developer_v1: {
    name: 'developer',
    read: {
      process: validateDeveloper,
      version: '^1.0.0',
    },
    write: {
      process: validateDeveloper,
      version: '1.0.0',
    },
  },
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
export type Payload = {
  mainframe: string,
  version: string,
  data: any,
}

export const createWriter = (key: Protocol) => {
  const protocol = PROTOCOLS[key]
  if (protocol == null) {
    throw new Error(`Unsupported protocol: ${key}`)
  }

  return async (data: any): Payload => {
    const processed = await protocol.write.process(data)
    return {
      mainframe: protocol.name,
      version: protocol.write.version,
      data: processed,
    }
  }
}

export const createReader = (key: Protocol) => {
  const protocol = PROTOCOLS[key]
  if (protocol == null) {
    throw new Error(`Unsupported protocol: ${key}`)
  }

  return async (payload: Payload) => {
    if (payload.mainframe !== protocol.name) {
      throw new Error('Unsupported payload')
    }
    if (!semver.valid(payload.version)) {
      throw new Error(`Invalid version: ${payload.version}`)
    }
    if (!semver.satisfies(payload.version, protocol.read.version)) {
      throw new Error(`Unsupported version: ${payload.version}`)
    }
    return await protocol.read.process(payload.data)
  }
}

export const readAppManifest = createReader('appManifest_v1')
export const writeAppManifest = createWriter('appManifest_v1')

export const readDeveloper = createReader('developer_v1')
export const writeDeveloper = createWriter('developer_v1')

export const readFirstContact = createReader('firstContact_v1')
export const writeFirstContact = createWriter('firstContact_v1')

export const readPeer = createReader('peer_v1')
export const writePeer = createWriter('peer_v1')
