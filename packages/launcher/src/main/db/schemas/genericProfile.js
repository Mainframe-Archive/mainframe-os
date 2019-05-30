// @flow

import ethAddress from './ethAddress'

export type GenericProfile = {
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
}

export default {
  title: 'generic profile',
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
