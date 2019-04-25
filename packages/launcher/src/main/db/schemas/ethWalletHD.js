// @flow

export default {
  title: 'Ethereum HD wallet',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    mnemonic: {
      type: 'string',
      final: true,
    },
    hdPath: {
      type: 'string',
      default: `m/44'/60'/0'/0`,
    },
    activeAccounts: {
      type: 'array',
      items: {
        type: 'string',
      },
      default: ['0'],
    },
  },
}
