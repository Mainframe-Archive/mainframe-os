// @flow

import { ipcMain, type BrowserWindow } from 'electron'
import { Subject, Subscriber, Subscription } from 'rxjs'
import { AnonymousSubject } from 'rxjs/internal/Subject'

export class ElectronTransport extends AnonymousSubject<Object> {
  constructor(window: BrowserWindow, channel: ?string = 'rpc-message') {
    super()

    this._output = new Subject()

    this.destination = Subscriber.create(
      msg => {
        window.send(channel, msg)
      },
      err => {
        this._output.error(err)
        this._reset()
      },
    )

    ipcMain.on(channel, (event, msg) => {
      try {
        this._output.next(msg)
      } catch (err) {
        this._output.error(err)
      }
    })
  }

  _subscribe(subscriber: Subscriber<Object>) {
    const subscription = new Subscription()
    subscription.add(this._output.subscribe(subscriber))
    return subscription
  }
}
