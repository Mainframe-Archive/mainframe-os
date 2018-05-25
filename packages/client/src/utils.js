// @flow

import { encodeBase64, type base64 } from '@mainframe/utils-base64'
import sodium from 'sodium-universal'

export const encodeVaultKey = (
  passphrase: string,
  fill: string = '0',
): base64 => {
  // Ensure key is not longer than the max size
  let key = Buffer.from(passphrase).slice(0, sodium.crypto_secretbox_KEYBYTES)
  const remaining = sodium.crypto_secretbox_KEYBYTES - key.length
  // Fill remaining space to make sure the length is correct
  if (remaining > 0) {
    key = Buffer.concat([key, Buffer.alloc(remaining, fill)])
  }
  return encodeBase64(key)
}
