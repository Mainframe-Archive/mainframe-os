// @flow

import bzzHash from './bzzHash'
import ethAddress from './ethAddress'

export default {
  title: 'own Swarm feed',
  version: 0,
  encrypted: true,
  type: 'object',
  properties: {
    privateKey: {
      type: 'string', // hex
      final: true,
    },
    address: {
      ...ethAddress,
      final: true,
    },
    contentHash: bzzHash,
    contentValue: {
      type: 'string', // JSON-stringified object
    },
  },
}
