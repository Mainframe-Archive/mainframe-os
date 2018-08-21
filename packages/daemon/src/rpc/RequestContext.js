// @flow

import type { Socket } from 'net'
import type { Environment } from '@mainframe/config'
import type { ID } from '@mainframe/utils-id'
import Bzz from 'erebos-api-bzz-node'
import Web3 from 'web3'

import type { Vault, VaultRegistry } from '../vault'

import type { NotifyFunc } from './handleClient'

type LogFunc = (...args: Array<any>) => void

type Params = {
  log: LogFunc,
  env: Environment,
  notify: NotifyFunc,
  socket: Socket,
  vaults: VaultRegistry,
}

export default class RequestContext {
  _bzz: ?Bzz
  _web3: ?Web3
  _env: Environment
  _notify: NotifyFunc
  _socket: Socket
  _vaults: VaultRegistry
  _subscriptions: { [ID]: string } = {}
  log: LogFunc

  constructor(params: Params) {
    this._env = params.env
    this._notify = params.notify
    this._socket = params.socket
    this._vaults = params.vaults
    this.log = params.log
  }

  get bzz(): Bzz {
    if (this._bzz == null) {
      this._bzz = new Bzz(this.openVault.settings.bzzURL)
    }
    return this._bzz
  }

  get web3(): Web3 {
    if (this._web3 == null) {
      this._web3 = new Web3(
        new Web3.providers.HttpProvider(
          this.openVault.settings.web3HTTPProvider,
        ),
      )
    }
    return this._web3
  }

  get env(): Environment {
    return this._env
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
