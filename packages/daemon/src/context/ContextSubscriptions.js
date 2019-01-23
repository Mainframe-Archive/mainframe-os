// @flow

import { uniqueID, type ID } from '@mainframe/utils-id'

import type ClientContext from './ClientContext'

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

export default class ContextSubscriptions {
  _context: ClientContext
  _subscriptions: { [ID]: ContextSubscription<any> } = {}

  constructor(context: ClientContext) {
    this._context = context
  }

  set(sub: ContextSubscription<any>): void {
    this._subscriptions[sub.id] = sub
  }

  create<T: ?mixed>(method: string, data?: T): ContextSubscription<T> {
    const sub = new ContextSubscription(method, data)
    this.set(sub)
    return sub
  }

  async remove(id: ID) {
    const sub = this._subscriptions[id]
    if (sub != null) {
      await sub.dispose()
      delete this._subscriptions[id]
    }
  }

  notify(id: ID, result: Object) {
    const sub = this._subscriptions[id]
    if (sub != null) {
      this._context.notify(sub.method, { subscription: id, result })
    }
  }

  async clear() {
    const disposeSubs = Object.values(this._subscriptions).map(sub => {
      // $FlowFixMe: Object.values() losing type
      return sub.dispose()
    })
    await Promise.all(disposeSubs)
    this._subscriptions = {}
  }
}
