// @flow

import type { Socket } from 'net'
import type { Environment } from '@mainframe/config'
import type StreamRPC from '@mainframe/rpc-stream'
import createWebSocketRPC from '@mainframe/rpc-ws-node'
import { uniqueID, type ID } from '@mainframe/utils-id'
import Bzz from 'erebos-api-bzz-node'
import Pss from 'erebos-api-pss'
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

export class ContextSubscription<T = ?mixed> {
  _id: ID
  _method: string
  data: ?T

  constructor(method: string, data?: T) {
    this._id = uniqueID()
    this._method = method
    this.data = data
  }

  get id(): ID {
    return this._id
  }

  get method(): string {
    return this._method
  }

  async dispose() {}
}

export default class RequestContext {
  _rpc: ?StreamRPC
  _bzz: ?Bzz
  _pss: ?Pss
  _web3: ?Web3
  _env: Environment
  _notify: NotifyFunc
  _socket: Socket
  _vaults: VaultRegistry
  _subscriptions: { [ID]: ContextSubscription<any> } = {}

  log: LogFunc

  constructor(params: Params) {
    this._env = params.env
    this._notify = params.notify
    this._socket = params.socket
    this._vaults = params.vaults
    this.log = params.log
  }

  get rpc(): StreamRPC {
    if (this._rpc == null) {
      this._rpc = createWebSocketRPC(this.openVault.settings.pssURL)
    }
    return this._rpc
  }

  get bzz(): Bzz {
    if (this._bzz == null) {
      this._bzz = new Bzz(this.openVault.settings.bzzURL)
    }
    return this._bzz
  }

  get pss(): Pss {
    if (this._pss == null) {
      this._pss = new Pss(this.rpc)
    }
    return this._pss
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

  async clear() {
    const disposeSubs = Object.values(this._subscriptions).map(sub => {
      // $FlowFixMe: Object.values() losing type
      return sub.dispose()
    })
    await Promise.all(disposeSubs)
    this._subscriptions = {}
    this._bzz = undefined
    this._pss = undefined
    this._web3 = undefined
    if (this._rpc != null) {
      this._rpc.disconnect()
    }
  }

  setSubscription(sub: ContextSubscription<any>): void {
    this._subscriptions[sub.id] = sub
  }

  createSubscription<T: ?mixed>(
    method: string,
    data?: T,
  ): ContextSubscription<T> {
    const sub = new ContextSubscription(method, data)
    this.setSubscription(sub)
    return sub
  }

  removeSubscription(id: ID) {
    const sub = this._subscriptions[id]
    if (sub != null) {
      sub.dispose()
      delete this._subscriptions[id]
    }
  }

  notify(id: ID, result: Object) {
    const sub = this._subscriptions[id]
    if (sub != null) {
      this._notify(sub.method, { subscription: id, result })
    }
  }
}
