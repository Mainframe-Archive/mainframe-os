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
    privateProfile: {
      type: 'boolean',
      default: true,
    },
    publicFeed: ownFeed,
    firstContactFeed: ownFeed,
    contacts: {
      type: 'array',
      items: {
        type: 'string',
        ref: COLLECTION_NAMES.CONTACTS,
      },
    },
    contactsRequests: {
      type: 'array',
      items: {
        type: 'string',
        ref: COLLECTION_NAMES.CONTACT_REQUESTS,
      },
    },
    ethWallets: {
      type: 'object',
      properties: {
        hd: {
          type: 'array',
          items: {
            type: 'string',
            ref: COLLECTION_NAMES.ETH_WALLETS_HD,
          },
        },
        ledger: {
          type: 'array',
          items: {
            type: 'string',
            ref: COLLECTION_NAMES.ETH_WALLETS_LEDGER,
          },
        },
      },
    },
    settings: {
      type: 'object',
      properties: {
        bzzURL: {
          type: 'string',
          default: 'http://mainframe-gateways.net:8500',
        },
        ethURL: {
          type: 'string',
          default: ETH_RPC_URLS.WS.mainnet,
        },
      },
    },
  },
  required: ['localID', 'keyPair', 'profile'],
}
