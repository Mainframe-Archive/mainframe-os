// @flow

import type { Socket } from 'net'
import type { Environment } from '@mainframe/config'
import { Subject } from 'rxjs'

import type { NotifyFunc } from '../rpc/handleClient'
import type { Vault, VaultRegistry } from '../vault'

import ContextEvents from './ContextEvents'
import ContextIO from './ContextIO'
import ContextMutations, { type MutationEventType } from './ContextMutations'
import ContextSubscriptions from './ContextSubscriptions'

export type ContextEventType = MutationEventType

export type ContextEvent = {
  type: ContextEventType,
}

type LogFunc = (...args: Array<any>) => void

type Params = {
  log: LogFunc,
  env: Environment,
  notify: NotifyFunc,
  socket: Socket,
  vaults: VaultRegistry,
}

export default class ClientContext extends Subject<ContextEvent> {
  env: Environment
  events: ContextEvents
  io: ContextIO
  log: LogFunc
  mutations: ContextMutations
  notify: NotifyFunc
  socket: Socket
  subscriptions: ContextSubscriptions
  vaults: VaultRegistry

  constructor(params: Params) {
    super()
    this.env = params.env
    this.log = params.log
    this.notify = params.notify
    this.socket = params.socket
    this.vaults = params.vaults
    this.events = new ContextEvents(this)
    this.io = new ContextIO(this)
    this.mutations = new ContextMutations(this)
    this.subscriptions = new ContextSubscriptions(this)
  }

  get openVault(): Vault {
    const vault = this.vaults.getVault(this.socket)
    if (vault == null) {
      throw new Error('Vault is not open')
    }
    return vault
  }

  async clear() {
    this.unsubscribe()

    this.events.clear()
    this.io.clear()
    await this.subscriptions.clear()
  }
}
