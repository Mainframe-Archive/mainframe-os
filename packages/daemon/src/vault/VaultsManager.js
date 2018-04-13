// @flow

import type { Socket } from 'net'

import Vault from './Vault'

export default class VaultsManager {
  _vault: ?Vault
  _clients: WeakSet<Socket> = new WeakSet()

  getVault(client: Socket): ?Vault {
    if (this._clients.has(client)) {
      return this._vault
    }
  }

  open(client: Socket, path: string, key: Buffer): Promise<void> {
    if (this._vault != null && !this._vault.checkKey(key)) {
      throw new Error('Invalid key')
    }

    if (this._vault == null) {
      this._vault = new Vault(path, key)
      this._vault.open()
    }

    this._clients.add(client)

    // Added check needed for Flow
    return this._vault == null
      ? Promise.reject(new Error('Could not open vault'))
      : this._vault.opened
  }

  async create(client: Socket, path: string, key: Buffer): Promise<Vault> {
    if (this._vault != null) {
      throw new Error('Vault already exists')
    }
    this._clients.add(client)
    this._vault = await Vault.create(path, key)
    return this._vault
  }
}
