// @flow

import { ETH_RPC_URLS } from '@mainframe/eth'

import { COLLECTION_NAMES } from '../constants'

import keyPair from './keyPair'
import ownFeed from './ownFeed'
import userProfile from './userProfile'

export default {
  title: 'local user schema',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    keyPair,
    profile: userProfile,
    profileHash: {
      type: 'string',
    },
    privateProfile: {
      type: 'boolean',
      default: true,
    },
    firstContactFeed: ownFeed,
    contacts: {
      type: 'array',
      ref: COLLECTION_NAMES.CONTACTS,
      items: {
        type: 'string',
      },
      default: [],
    },
    contactsRequests: {
      type: 'array',
      ref: COLLECTION_NAMES.CONTACT_REQUESTS,
      items: {
        type: 'string',
      },
      default: [],
    },
    ethWallets: {
      type: 'object',
      properties: {
        hd: {
          type: 'array',
          ref: COLLECTION_NAMES.ETH_WALLETS_HD,
          items: {
            type: 'string',
          },
        },
        ledger: {
          type: 'array',
          ref: COLLECTION_NAMES.ETH_WALLETS_LEDGER,
          items: {
            type: 'string',
          },
        },
      },
      default: {
        hd: [],
        ledger: [],
      },
    },
    ethURL: {
      type: 'string',
      default: ETH_RPC_URLS.WS.mainnet,
    },
    bzzURL: {
      type: 'string',
      default: 'http://mainframe-gateways.net:8500',
    },
  },
  required: ['localID', 'keyPair', 'profile', 'firstContactFeed'],
}
