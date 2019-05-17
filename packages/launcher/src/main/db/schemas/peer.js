// @flow

import ethAddress from './ethAddress'
import profile from './userProfile'

export default {
  title: 'peer',
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
    otherFeeds: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
          },
          address: ethAddress,
        },
      },
      default: [],
    },
    publicKey: {
      type: 'string',
    },
    profile,
  },
}
