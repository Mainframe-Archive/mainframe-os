// @flow

import ethAddress from './ethAddress'
import profile from './genericProfile'

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
