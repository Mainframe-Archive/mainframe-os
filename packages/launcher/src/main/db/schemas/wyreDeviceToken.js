// @flow

export default {
  title: 'Wyre data',
  version: 0,
  type: 'object',
  properties: {
    deviceToken: { type: 'string' },
    name: { type: 'string', primary: true },
  },
  // pattern: '^0x[0-9a-fA-F]{40}$',
}
