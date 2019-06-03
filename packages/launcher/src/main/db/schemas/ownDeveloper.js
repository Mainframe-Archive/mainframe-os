// @flow

import keyPair, { type KeyPairData } from './keyPair'
import profile, { type GenericProfileData } from './genericProfile'

export type OwnDeveloperData = {
  localID: string,
  keyPair: KeyPairData,
  profile: GenericProfileData,
  profileHash: ?string,
}

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
