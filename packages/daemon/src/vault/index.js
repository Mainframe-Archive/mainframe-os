// @flow

import type { Socket } from 'net'

import Vault from './Vault'

let vault: ?Vault = null
const clients: WeakSet<Socket> = new WeakSet()

export const getVault = (client: Socket): ?Vault => {
  if (clients.has(client)) {
    return vault
  }
}

export const openVault = async (
  client: Socket,
  path: string,
  key: Buffer,
): Promise<void> => {
  if (vault != null && !vault.checkKey(key)) {
    throw new Error('Invalid key')
  }

  if (vault == null) {
    vault = await Vault.open(path, key)
  }
  clients.add(client)
}

export const createVault = async (
  client: Socket,
  path: string,
  key: Buffer,
): Promise<Vault> => {
  if (vault != null) {
    throw new Error('Vault already exists')
  }
  vault = await Vault.create(path, key)
  clients.add(client)
  return vault
}
