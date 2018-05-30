// @flow

import type { Socket } from 'net'

import type { Vault, VaultRegistry } from '../vault'

export default class RequestContext {
  _socket: Socket
  _vaults: VaultRegistry

  constructor(socket: Socket, vaults: VaultRegistry) {
    this._socket = socket
    this._vaults = vaults
  }

  get socket(): Socket {
    return this._socket
  }

  get vaults(): VaultRegistry {
    return this._vaults
  }

  get openVault(): Vault {
    const vault = this._vaults.getVault(this._socket)
    if (vault == null) {
      throw new Error('Vault is not open')
    }
    return vault
  }
}
