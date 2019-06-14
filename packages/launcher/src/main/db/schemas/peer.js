// @flow

import ethAddress from './ethAddress'
import profile, { type GenericProfileData } from './genericProfile'

export type PeerData = {|
  localID: string,
  publicFeed: string,
  otherFeeds: Array<{| type: string, address: string |}>,
  publicKey: ?string,
  profile: ?GenericProfileData,
|}

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
