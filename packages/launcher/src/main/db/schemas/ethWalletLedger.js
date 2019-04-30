// @flow

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
      type: 'string',
      final: true,
    },
    name: {
      type: 'string',
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
          address: {
            type: 'string',
          },
        },
      },
    },
  },
}
