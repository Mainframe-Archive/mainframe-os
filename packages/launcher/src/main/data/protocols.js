// @flow

import createHex from '@erebos/hex'
import { verify } from '@erebos/secp256k1'
import Ajv from 'ajv'
import semver from 'semver'

import { APP_FEED_V0 } from './constants'
import { appFeedSchema } from './schemas/app'

const ajv = new Ajv()
ajv.addSchema([appFeedSchema])

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

export const validateAppFeed = async (data: Object = {}, author?: ?string) => {
  try {
    await validateSchema(APP_FEED_V0, data)
  } catch (err) {
    throw new Error('Invalid data')
  }
  const { signature, ...rest } = data
  const verified = verify(
    createHex(rest).toBytesArray(),
    createHex(signature).toBytesArray(),
    author || rest.content.authorKey,
  )
  if (!verified) {
    throw new Error('Invalid signature')
  }
  return data
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

  return async (data: any): Promise<Payload> => {
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

export const readDeveloper = createReader('developer_v1')
export const writeDeveloper = createWriter('developer_v1')

export const readFirstContact = createReader('firstContact_v1')
export const writeFirstContact = createWriter('firstContact_v1')

export const readPeer = createReader('peer_v1')
export const writePeer = createWriter('peer_v1')
