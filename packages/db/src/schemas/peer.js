// @flow

import profile from './userProfile'

export default {
  title: 'peer',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    profile,
    // TODO: other fields
  },
}
