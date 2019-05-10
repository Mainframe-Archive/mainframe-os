// @flow

import { createKeyPair } from '@erebos/secp256k1'

export const generateKeyPair = () => {
  const kp = createKeyPair()
  return {
    publicKey: kp.getPublic('hex'),
    privateKey: kp.getPrivate('hex'),
  }
}
