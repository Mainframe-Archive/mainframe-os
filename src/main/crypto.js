// @flow

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'

export type Encoded = {
  algorithm: string,
  iv: string,
  authTag: string,
  ciphertext: string,
}

export const randomBytesAsync = async (size: number): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    randomBytes(size, (err, bytes) => {
      if (err) reject(err)
      else resolve(bytes)
    })
  })
}

export const decode = (key: Buffer, data: Encoded): Object => {
  if (data.algorithm !== ALGORITHM) {
    throw new Error('Unsupported algorithm')
  }
  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(data.iv, 'base64'),
  )
  decipher.setAuthTag(Buffer.from(data.authTag, 'base64'))
  let decrypted = decipher.update(data.ciphertext, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return JSON.parse(decrypted)
}

export const createDecoder = (key: Buffer) => {
  return (data: Encoded) => decode(key, data)
}

export const encode = async (key: Buffer, data: Object): Promise<Encoded> => {
  const iv = await randomBytesAsync(16)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return {
    algorithm: ALGORITHM,
    authTag: cipher.getAuthTag().toString('base64'),
    ciphertext: encrypted,
    iv: iv.toString('base64'),
  }
}

export const createEncoder = (key: Buffer) => {
  return async (data: Object) => await encode(key, data)
}
