// @flow

import { COLLECTION_NAMES } from '../constants'

import bidirectionalFeed from './bidirectionalFeed'
import userProfile from './userProfile'

const invite = {
  title: 'contact invite',
  version: 0,
  type: 'object',
  properties: {
    chain: {
      type: 'integer',
    },
    inviteTX: {
      type: 'string',
      final: true,
    },
    fromAddress: {
      type: 'string',
      final: true,
    },
    toAddress: {
      type: 'string',
      final: true,
    },
    acceptedSignature: {
      type: 'string',
    },
    ethNetwork: {
      type: 'string',
      final: true,
    },
    stakeAmount: {
      type: 'string',
      final: true,
    },
    stakeState: {
      type: 'string',
      enum: ['sending', 'staked', 'reclaiming', 'reclaimed', 'seized'],
    },
    stakeReclaimedTX: {
      type: 'string',
    },
  },
  required: ['stakeState'],
}

export default {
  title: 'contact',
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
    profile: userProfile,
    aliasName: {
      type: 'string',
    },
    sharedFeed: bidirectionalFeed,
    feedRequestSent: {
      type: 'boolean',
      default: false,
    },
    invite,
    acceptanceSignature: {
      type: 'string',
    },
  },
  required: ['peer', 'profile', 'sharedFeed'],
}
