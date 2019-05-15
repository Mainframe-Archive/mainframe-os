// @flow

import ethAddress from './ethAddress'

export default {
  title: 'Ethereum Ledger wallet',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    firstAddress: {
      ...ethAddress,
      final: true,
    },
    name: {
      type: 'string',
    },
    legacyPath: {
      type: 'boolean',
    },
    activeAccounts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: {
            type: 'integer',
            minimum: 0,
          },
          address: ethAddress,
        },
      },
    },
  },
}
