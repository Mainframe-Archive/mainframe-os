// @flow

import ethAddress from './ethAddress'

export type UserProfile = {
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
}

export default {
  title: 'user profile',
  version: 0,
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },
    ethAddress,
  },
}
