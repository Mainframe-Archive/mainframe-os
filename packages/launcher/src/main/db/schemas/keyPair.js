// @flow

export default {
  title: 'base64-encoded key pair',
  encrypted: true,
  version: 0,
  type: 'object',
  properties: {
    publicKey: {
      type: 'string',
      final: true,
    },
    secretKey: {
      type: 'string',
      final: true,
    },
  },
}
