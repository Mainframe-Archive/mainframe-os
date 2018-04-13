// @flow

import sodium from 'sodium-native'

export type KeyPair = {
  publicKey: Buffer,
  secretKey: Buffer,
}

export type EncryptedMessage = {
  cipher: Buffer,
  nonce: Buffer,
}

// Randomness

export const randomBytes = (size: number): Buffer => {
  const buffer = Buffer.allocUnsafe(size)
  sodium.randombytes_buf(buffer)
  return buffer
}

export const secureRandomBytes = (size: number): Buffer => {
  const buffer = sodium.sodium_malloc(size)
  sodium.randombytes_buf(buffer)
  return buffer
}

// Asymmetric encryption

export const createAsymKeyPair = (seed?: Buffer): KeyPair => {
  if (seed != null && seed.length < sodium.crypto_box_SEEDBYTES) {
    throw new Error(
      `Invalid seed, must be at least ${
        sodium.crypto_box_SEEDBYTES
      } bytes long`,
    )
  }

  const publicKey = Buffer.allocUnsafe(sodium.crypto_box_PUBLICKEYBYTES)
  const secretKey = sodium.sodium_malloc(sodium.crypto_box_SECRETKEYBYTES)

  if (seed == null) {
    sodium.crypto_box_keypair(publicKey, secretKey)
  } else {
    sodium.crypto_box_seed_keypair(publicKey, secretKey, seed)
  }

  return { publicKey, secretKey }
}

export const encryptAsym = (
  message: Buffer,
  publicKey: Buffer,
  secretKey: Buffer,
): EncryptedMessage => {
  const cipher = Buffer.allocUnsafe(message.length + sodium.crypto_box_MACBYTES)
  const nonce = randomBytes(sodium.crypto_box_NONCEBYTES)
  sodium.crypto_box_easy(cipher, message, nonce, publicKey, secretKey)
  return { cipher, nonce }
}

export const decryptAsym = (
  encrypted: EncryptedMessage,
  publicKey: Buffer,
  secretKey: Buffer,
): ?Buffer => {
  const message = Buffer.allocUnsafe(
    encrypted.cipher.length - sodium.crypto_box_MACBYTES,
  )
  const decrypted = sodium.crypto_box_open_easy(
    message,
    encrypted.cipher,
    encrypted.nonce,
    publicKey,
    secretKey,
  )
  if (decrypted) {
    return message
  }
}

// Symmetric encryption

export const createSymKey = (): Buffer =>
  secureRandomBytes(sodium.crypto_secretbox_KEYBYTES)

export const encryptSym = (message: Buffer, key: Buffer): EncryptedMessage => {
  const cipher = Buffer.allocUnsafe(
    message.length + sodium.crypto_secretbox_MACBYTES,
  )
  const nonce = randomBytes(sodium.crypto_secretbox_NONCEBYTES)
  sodium.crypto_secretbox_easy(cipher, message, nonce, key)
  return { cipher, nonce }
}

export const decryptSym = (
  encrypted: EncryptedMessage,
  key: Buffer,
): ?Buffer => {
  const message = Buffer.allocUnsafe(
    encrypted.cipher.length - sodium.crypto_secretbox_MACBYTES,
  )
  const decrypted = sodium.crypto_secretbox_open_easy(
    message,
    encrypted.cipher,
    encrypted.nonce,
    key,
  )
  if (decrypted) {
    return message
  }
}

// Signatures

export const createSignKeyPair = (seed?: Buffer): KeyPair => {
  if (seed != null && seed.length < sodium.crypto_sign_SEEDBYTES) {
    throw new Error(
      `Invalid seed, must be at least ${
        sodium.crypto_sign_SEEDBYTES
      } bytes long`,
    )
  }

  const publicKey = Buffer.allocUnsafe(sodium.crypto_sign_PUBLICKEYBYTES)
  const secretKey = sodium.sodium_malloc(sodium.crypto_sign_SECRETKEYBYTES)

  if (seed == null) {
    sodium.crypto_sign_keypair(publicKey, secretKey)
  } else {
    sodium.crypto_sign_seed_keypair(publicKey, secretKey, seed)
  }

  return { publicKey, secretKey }
}

export const getSignature = (message: Buffer, secretKey: Buffer): Buffer => {
  const signature = Buffer.allocUnsafe(sodium.crypto_sign_BYTES)
  sodium.crypto_sign_detached(signature, message, secretKey)
  return signature
}

export const verifySignature = (
  message: Buffer,
  signature: Buffer,
  publicKey: Buffer,
): boolean => sodium.crypto_sign_verify_detached(signature, message, publicKey)

export const sign = (message: Buffer, secretKey: Buffer): Buffer => {
  const signed = Buffer.allocUnsafe(sodium.crypto_sign_BYTES + message.length)
  sodium.crypto_sign(signed, message, secretKey)
  return signed
}

export const open = (signed: Buffer, publicKey: Buffer): ?Buffer => {
  const message = Buffer.allocUnsafe(signed.length - sodium.crypto_sign_BYTES)
  const verified = sodium.crypto_sign_open(message, signed, publicKey)
  if (verified) {
    return message
  }
}
