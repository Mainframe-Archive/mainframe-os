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
    activeAccounts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: {
            type: 'string',
          },
          address: {
            type: 'string',
          },
        },
      },
    },
    firstAddress: {
      type: 'string',
    },
  },
}
