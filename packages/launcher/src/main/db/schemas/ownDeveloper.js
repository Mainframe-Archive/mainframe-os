// @flow

import keyPair from './keyPair'
import ownFeed from './ownFeed'

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
    publicFeed: ownFeed,
    name: {
      type: 'string',
    },
  },
  required: ['keyPair', 'name'],
}
