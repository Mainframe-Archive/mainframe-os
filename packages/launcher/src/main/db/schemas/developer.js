// @flow

import ethAddress from './ethAddress'
import profile, { type GenericProfileData } from './genericProfile'

export type DeveloperData = {
  localID: string,
  publicFeed: string,
  publicKey: ?string,
  profile: ?GenericProfileData,
}

export default {
  title: 'developer',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    publicFeed: {
      ...ethAddress,
      final: true,
    },
    publicKey: {
      type: 'string',
    },
    profile,
  },
}
