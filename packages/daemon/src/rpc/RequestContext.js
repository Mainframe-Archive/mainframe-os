// @flow

import type { Socket } from 'net'
import type { ID } from '@mainframe/utils-id'

import type { Vault, VaultRegistry } from '../vault'

import type { NotifyFunc } from './handleClient'

export default class RequestContext {
  _notify: NotifyFunc
  _socket: Socket
  _vaults: VaultRegistry
  _subscriptions: { [ID]: string } = {}

  constructor(socket: Socket, vaults: VaultRegistry, notify: NotifyFunc) {
    this._notify = notify
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

  addSubscription(id: ID, method: string) {
    this._subscriptions[id] = method
  }

  removeSubscription(id: ID) {
    delete this._subscriptions[id]
  }

  notify(id: ID, result: Object) {
    const method = this._subscriptions[id]
    if (method != null) {
      this._notify(method, { subscription: id, result })
    }
  }
}
