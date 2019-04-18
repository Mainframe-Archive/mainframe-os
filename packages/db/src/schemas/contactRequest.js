// @flow

import { COLLECTION_NAMES } from '../constants'

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
      type: 'string',
      final: true,
    },
    receivedAddress: {
      type: 'string',
      final: true,
    },
    senderAddress: {
      type: 'string',
      final: true,
    },
    rejectedTXHash: {
      type: 'string',
    },
  },
}
