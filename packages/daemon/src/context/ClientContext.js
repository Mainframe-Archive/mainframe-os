// @flow

import type { Socket } from 'net'
import type { Environment } from '@mainframe/config'
import { type Observable, Subject, type Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'

import type { NotifyFunc } from '../rpc/handleClient'
import type { Vault, VaultRegistry } from '../vault'

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

type ContextEvents = { vaultOpened: Observable<ContextEvent> }
type ContextInternalSubscriptions = { [key: string]: Subscription }

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

  _internalSubscriptions: ContextInternalSubscriptions

  constructor(params: Params) {
    super()
    this.env = params.env
    this.log = params.log
    this.notify = params.notify
    this.socket = params.socket
    this.vaults = params.vaults
    this.io = new ContextIO(this)
    this.mutations = new ContextMutations(this)
    this.subscriptions = new ContextSubscriptions(this)
    this.events = this.setupEvents()
    this._internalSubscriptions = this.setupInternalSubscriptions(this.events)
  }

  get openVault(): Vault {
    const vault = this.vaults.getVault(this.socket)
    if (vault == null) {
      throw new Error('Vault is not open')
    }
    return vault
  }

  // Only return Observables here, these are lazy so they will only be executed if a subscriber gets attached
  setupEvents(): ContextEvents {
    return {
      vaultOpened: this.pipe(
        filter((e: ContextEvent) => {
          return e.type === 'vault_created' || e.type === 'vault_opened'
        }),
      ),
    }
  }

  // These are internal subscriptions, setup as soon as the ClientContext is created when a client connects to the daemon
  setupInternalSubscriptions(
    events: ContextEvents,
  ): ContextInternalSubscriptions {
    return {
      doSomethingOnVaultOpened: events.vaultOpened.subscribe(() => {
        this.log('subscription says vault got opened')
      }),
    }
  }

  async clear() {
    this.unsubscribe()

    Object.values(this._internalSubscriptions).forEach(sub => {
      // $FlowFixMe: Object.values() losing type
      sub.unsubscribe()
    })
    this._internalSubscriptions = {}

    await this.subscriptions.clear()
    this.io.clear()
  }
}
