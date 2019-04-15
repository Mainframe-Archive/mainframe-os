// @flow

import type { Socket } from 'net'
import type { Environment } from '@mainframe/config'
import { Subject } from 'rxjs'

import type { NotifyFunc } from '../rpc/handleClient'
import type { Vault, VaultRegistry } from '../vault'

import ContextEvents from './ContextEvents'
import ContextIO from './ContextIO'
import ContextMutations from './ContextMutations'
import ContextQueries from './ContextQueries'
import ContextSubscriptions from './ContextSubscriptions'
import InvitesHandler from './InvitesHandler'
import { AppsUpdatesHandler, ContactsFeedsHandler } from './FeedsHandler'
import type { ContextEvent } from './types'

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
  queries: ContextQueries
  socket: Socket
  subscriptions: ContextSubscriptions
  vaults: VaultRegistry
  appsUpdates: AppsUpdatesHandler
  contactsFeeds: ContactsFeedsHandler
  invitesHandler: InvitesHandler

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
    this.queries = new ContextQueries(this)
    this.subscriptions = new ContextSubscriptions(this)
    this.appsUpdates = new AppsUpdatesHandler(this)
    this.contactsFeeds = new ContactsFeedsHandler(this)
    this.invitesHandler = new InvitesHandler(this)
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

    const openVault = this.vaults.getVault(this.socket)
    if (openVault != null) {
      await openVault.save()
    }
  }
}
