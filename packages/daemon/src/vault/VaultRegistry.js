// @flow

import type { Socket } from 'net'

import Vault from './Vault'

export default class VaultRegistry {
  _socketByVaultPath: Map<string, Socket> = new Map()
  _vaultBySocket: WeakMap<Socket, Vault> = new WeakMap()

  getVault(socket: Socket): ?Vault {
    return this._vaultBySocket.get(socket)
  }

  isLocked(path: string): boolean {
    const socket = this._socketByVaultPath.get(path)
    if (socket == null) {
      return false
    }
    const existing = this.getVault(socket)
    if (existing == null) {
      // Socket no longer exists, remove lock
      this._socketByVaultPath.delete(path)
      return false
    }
    return true
  }

  async close(socket: Socket): Promise<void> {
    const vault = this.getVault(socket)
    if (vault != null) {
      await vault.save()
      this._socketByVaultPath.delete(vault.path)
      this._vaultBySocket.delete(socket)
    }
  }

  async create(socket: Socket, path: string, password: Buffer): Promise<Vault> {
    if (this.isLocked(path)) {
      throw new Error('Vault is already open by another client')
    }

    const vault = await Vault.create(path, password)
    this._socketByVaultPath.set(path, socket)
    this._vaultBySocket.set(socket, vault)

    return vault
  }

  async open(socket: Socket, path: string, password: Buffer): Promise<Vault> {
    if (this.isLocked(path)) {
      throw new Error('Vault is already open by another client')
    }

    const vault = await Vault.open(path, password)
    this._socketByVaultPath.set(path, socket)
    this._vaultBySocket.set(socket, vault)

    return vault
  }
}
