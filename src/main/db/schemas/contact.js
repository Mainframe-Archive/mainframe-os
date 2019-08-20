// @flow

import { COLLECTION_NAMES } from '../constants'

import ethAddress from './ethAddress'
import profile, { type GenericProfileData } from './genericProfile'
import keyPair, { type KeyPairData } from './keyPair'

export type ContactInviteStakeState =
  | 'sending'
  | 'staked'
  | 'reclaiming'
  | 'reclaimed'
  | 'seized'

export type ContactInviteData = {|
  chain: ?number,
  inviteTX: string,
  fromAddress: string,
  toAddress: string,
  acceptedSignature: ?string,
  ethNetwork: string,
  stakeAmount: string,
  stakeState: ContactInviteStakeState,
  stakeReclaimedTX: ?string,
|}

export type ContactData = {|
  localID: string,
  peer: string,
  keyPair: KeyPairData,
  profile: GenericProfileData,
  aliasName: ?string,
  publicKey: ?string,
  firstContactFeedCreated: boolean,
  invite: ?ContactInviteData,
  acceptanceSignature: ?string,
|}

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
      ...ethAddress,
      final: true,
    },
    toAddress: {
      ...ethAddress,
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
    reclaimedStakeTX: {
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
      final: true,
    },
    keyPair,
    profile,
    aliasName: {
      type: 'string',
    },
    // Public key of the connected feed - part of first contact data
    publicKey: {
      type: 'string',
    },
    firstContactFeedCreated: {
      type: 'boolean',
      default: false,
    },
    invite,
    acceptanceSignature: {
      type: 'string',
    },
  },
  required: ['keyPair', 'profile'],
}
