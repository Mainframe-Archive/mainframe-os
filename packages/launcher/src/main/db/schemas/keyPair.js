// @flow

export default {
  title: 'hex-encoded secp256k1 key pair',
  encrypted: true,
  version: 0,
  type: 'object',
  properties: {
    privateKey: {
      type: 'string',
      final: true,
    },
    publicKey: {
      type: 'string',
      final: true,
    },
  },
}
