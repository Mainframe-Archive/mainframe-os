// @flow

import { COLLECTION_NAMES } from '../constants'

import ethAddress from './ethAddress'

export default {
  title: 'contact request',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    peer: {
      type: 'string',
      ref: COLLECTION_NAMES.PEERS,
    },
    ethNetwork: {
      type: 'string',
      final: true,
    },
    privateFeed: {
      ...ethAddress,
      final: true,
    },
    receivedAddress: {
      ...ethAddress,
      final: true,
    },
    senderAddress: {
      ...ethAddress,
      final: true,
    },
    rejectedTXHash: {
      type: 'string',
    },
  },
  required: ['peer'],
}
