// @flow

import type { Observable, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'

import type ClientContext, { ContextEvent } from './ClientContext'

export default class ContextEvents {
  vaultOpened: Observable<ContextEvent>

  _context: ClientContext
  _subscriptions: { [key: string]: Subscription } = {}

  constructor(context: ClientContext) {
    this._context = context

    this.vaultOpened = this._context.pipe(
      filter((e: ContextEvent) => {
        return e.type === 'vault_created' || e.type === 'vault_opened'
      }),
    )

    // Using addSubscription() will make sure the subscription will be cleared when the client disconnects
    this.addSubscription(
      'vaultOpened',
      this.vaultOpened.subscribe(() => {
        this._context.log('vault got opened!')
      }),
    )
  }

  addSubscription(key: string, subscription: Subscription) {
    this._subscriptions[key] = subscription
  }

  removeSubscription(key: string) {
    const sub = this._subscriptions[key]
    if (sub != null) {
      sub.unsubscribe()
    }
  }

  clear() {
    Object.values(this._subscriptions).forEach(sub => {
      // $FlowFixMe: Object.values() losing type
      sub.unsubscribe()
    })
    this._subscriptions = {}
  }
}
