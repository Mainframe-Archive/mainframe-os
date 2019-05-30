// @flow

import keyPair from './keyPair'
import profile from './genericProfile'

export default {
  title: 'own app developer',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    keyPair,
    profile,
    profileHash: {
      type: 'string',
    },
  },
  required: ['keyPair', 'profile'],
}
