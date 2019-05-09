// @flow

import semver from 'semver'

export const PROTOCOLS = {
  profile_v1: {
    name: 'profile',
    readVersion: '^1.0.0',
    writeVersion: '1.0.0',
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
    version: protocol.writeVersion,
    data,
  })
}

export const createReader = (key: Protocol) => {
  const protocol = PROTOCOLS[key]
  if (protocol == null) {
    throw new Error(`Unsupported protocol: ${key}`)
  }

  return (payload: Object) => {
    if (payload.mainframe !== protocol.name) {
      throw new Error('Unsupported payload')
    }
    if (!semver.valid(payload.version)) {
      throw new Error(`Invalid version: ${payload.version}`)
    }
    if (!semver.satisfies(payload.version, protocol.readVersion)) {
      throw new Error(`Unsupported version: ${payload.version}`)
    }
    return payload.data
  }
}

export const readProfile = createReader('profile_v1')
export const writeProfile = createWriter('profile_v1')
