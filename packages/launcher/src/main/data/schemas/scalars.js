// @flow

export const ethereumAddressProperty = {
  type: 'string',
  pattern: '^0x[0-9a-f]{40}$',
}

export const publicKeyProperty = {
  type: 'string',
  pattern: '^[0-9a-f]{130}$',
}

export const swarmHashProperty = {
  type: 'string',
  pattern: '^[0-9a-f]{64}$',
}
