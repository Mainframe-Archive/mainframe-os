// @flow

import type { KeyPairSerialized } from '../../crypto/ed25519'

export type KeyPair = KeyPairSerialized

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
