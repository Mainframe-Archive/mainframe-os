// @flow

import { COLLECTION_NAMES } from '../constants'

import ethAddress from './ethAddress'

export type ContactRequestData = {
  localID: string,
  peer: string,
  ethNetwork: string,
  privateFeed: string,
  receivedAddress: string,
  senderAddress: string,
  rejectedTXHash: ?string,
}

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
