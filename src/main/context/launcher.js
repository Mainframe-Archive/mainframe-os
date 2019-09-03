// @flow

import type { BrowserWindow } from 'electron'
import { graphql, parse, subscribe } from 'graphql'
import nanoid from 'nanoid'

import { LAUNCHER_CHANNEL } from '../../constants'
import { ROUTES } from '../../renderer/launcher/constants'

import type InvitesHandler from '../blockchain/InvitesHandler'
import type { Config } from '../config'
import type { UserDoc } from '../db/collections/users'
import type { DB } from '../db/types'
import type { SubscriptionIterator } from '../graphql/observableToAsyncIterator'
import schema from '../graphql/schema'
import type { Logger } from '../logger'

import { GraphQLContext } from './graphql'
import { SystemContext } from './system'

type NotifyFunc = (id: string, result?: Object) => void

class GraphQLSubscription {
  _iterator: SubscriptionIterator
  _running: boolean = false
  id: string

  constructor(iterator: SubscriptionIterator) {
    this._iterator = iterator
    this.id = nanoid()
  }

  async start(notify: NotifyFunc) {
    if (this._running) {
      throw new Error('Subscription is already started')
    }

    this._running = true
    for await (const result of this._iterator) {
      if (this._running && result != null) {
        notify(this.id, result)
      }
    }
  }

  async stop() {
    if (this._running === false) {
      throw new Error('Subscription is already stopped')
    }

    this._running = false
    await this._iterator.return()
  }
}

export type ContextParams = {
  launcherID: string,
  system: SystemContext,
  userID: ?string,
  window: BrowserWindow,
}

export class LauncherContext {
  _graphqlContext: ?GraphQLContext
  _graphqlSubscriptions: { [id: string]: GraphQLSubscription } = {}

  launcherID: string
  logger: Logger
  system: SystemContext
  userID: ?string
  window: BrowserWindow

  constructor(params: ContextParams) {
    this.launcherID = params.launcherID
    this.userID = params.userID
    this.system = params.system
    this.window = params.window
    this.logger = params.system.logger.child({
      context: 'launcher',
      launcherID: this.launcherID,
      userID: this.userID,
    })
    this.logger.debug('Launcher context created')
  }

  get config(): Config {
    return this.system.config
  }

  get db(): ?DB {
    return this.system.db
  }

  get graphqlContext(): GraphQLContext {
    if (this._graphqlContext == null) {
      this.logger.debug('Creating GraphQL context')
      if (this.db == null) {
        throw new Error(
          'Cannot create GraphQL context before database is accessible',
        )
      }
      if (this.userID == null) {
        throw new Error('Cannot create GraphQL context without a user')
      }
      this._graphqlContext = new GraphQLContext({
        db: this.db,
        logger: this.logger,
        system: this.system,
        user: this.system.getUserContext(this.userID),
      })
    }
    return this._graphqlContext
  }

  showWindow() {
    if (this.window.isMinimized()) {
      this.window.restore()
    }
    this.window.show()
  }

  async getUserChecked(): Promise<?UserDoc> {
    if (this.db == null || this.userID == null) {
      return
    }

    const id = this.userID
    const user = await this.db.users.findOne(id).exec()
    if (user == null) {
      this.logger.log({
        level: 'warn',
        message: 'User ID provided in context not found in DB',
        id,
      })
      this.userID = null
      if (id === this.system.defaultUser) {
        // TODO: get another user from DB to set as default?
        this.system.defaultUser = undefined
      }
      return
    }

    return user
  }

  async getInvitesSync(): Promise<InvitesHandler> {
    const user = await this.getUserChecked()
    if (user == null) {
      throw new Error('No user')
    }
    const invitesSync = user.getInvitesSync()
    if (invitesSync == null) {
      throw new Error('Invites sync is not setup')
    }
    return invitesSync
  }

  async getInitialRoute(): Promise<string> {
    if (this.db == null) {
      return this.config.get('dbCreated')
        ? ROUTES.ONBOARDING_OPEN
        : ROUTES.ONBOARDING_CREATE
    }

    const user = await this.getUserChecked()
    if (user == null) {
      return ROUTES.ONBOARDING_USER
    }

    return user.hasEthWallet() ? ROUTES.HOME : ROUTES.ONBOARDING_WALLET
  }

  graphqlNotify = (id: string, result?: Object = {}) => {
    this.logger.log({
      level: 'debug',
      message: 'Emit GraphQL subscription update',
      id,
      result,
    })
    this.window.send(LAUNCHER_CHANNEL, {
      jsonrpc: '2.0',
      method: 'graphql_subscription_update',
      params: { subscription: id, result },
    })
  }

  async query(query: string, variables?: Object = {}): Promise<Object> {
    return await graphql(schema, query, {}, this.graphqlContext, variables)
  }

  async subscribe(query: string, variables?: Object = {}): Promise<string> {
    // TODO: better check for the subscribe() return, it could be an ExecutionResult with errors
    // $FlowFixMe: AsyncIterator
    const iterator = await subscribe(
      schema,
      parse(query),
      {},
      this.graphqlContext,
      variables,
    )

    const subscription = new GraphQLSubscription(iterator)
    this._graphqlSubscriptions[subscription.id] = subscription

    subscription.start(this.graphqlNotify).catch(error => {
      this.logger.log({
        level: 'error',
        message: 'GraphQL subscription notification failed',
        error,
      })
      delete this._graphqlSubscriptions[subscription.id]
    })

    return subscription.id
  }

  async unsubscribe(id: string) {
    const sub = this._graphqlSubscriptions[id]
    if (sub != null) {
      await sub.stop()
      delete this._graphqlSubscriptions[id]
    }
  }

  async clear() {
    try {
      await Promise.all(
        // $FlowFixMe: Object.values() losing type
        Object.values(this._graphqlSubscriptions).map(
          // $FlowFixMe: Object.values() losing type
          async (sub: GraphQLSubscription) => {
            await sub.stop()
          },
        ),
      )
    } catch (error) {
      this.logger.log({
        level: 'error',
        message: 'Failed to clear subscriptions',
        error: error.toString(),
      })
    }

    this._graphqlSubscriptions = {}
  }
}
