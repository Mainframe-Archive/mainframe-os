// @flow

import keyPair from './keyPair'

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
    name: {
      type: 'string',
    },
  },
  required: ['keyPair', 'name'],
}
