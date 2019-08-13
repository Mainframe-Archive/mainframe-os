// @flow

export type CoinbaseData = {
  state: string,
  name: string,
}

export default {
  title: 'Coinbase data',
  version: 0,
  type: 'object',
  properties: {
    state: { type: 'string' },
    name: { type: 'string', primary: true },
  },
  // pattern: '^0x[0-9a-fA-F]{40}$',
}
