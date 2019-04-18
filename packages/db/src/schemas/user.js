// @flow

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
      item: {
        type: 'string',
        ref: COLLECTION_NAMES.CONTACTS,
      },
    },
    contactsRequests: {
      type: 'array',
      item: {
        type: 'string',
        ref: COLLECTION_NAMES.CONTACT_REQUESTS,
      },
    },
  },
  required: ['localID', 'keyPair', 'profile'],
}
