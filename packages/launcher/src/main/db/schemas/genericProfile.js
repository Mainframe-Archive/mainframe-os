// @flow

import ethAddress from './ethAddress'

export type GenericProfileData = {
  name: ?string,
  avatar: ?string,
  ethAddress: ?string,
}

export type GenericProfile = $Shape<GenericProfileData>

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
