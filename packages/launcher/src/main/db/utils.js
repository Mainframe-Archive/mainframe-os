// @flow

import { createKeyPair } from '@erebos/secp256k1'
import generateID from 'nanoid/generate'

const ID_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const generateKeyPair = () => {
  const kp = createKeyPair()
  return {
    publicKey: kp.getPublic('hex'),
    privateKey: kp.getPrivate('hex'),
  }
}

export const generateLocalID = () => generateID(ID_CHARS, 20)
