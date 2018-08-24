// @flow

import type { BrowserWindow } from 'electron'
import StreamRPC from '@mainframe/rpc-stream'

import electronTransport from './electronTransport'

const generateId = () =>
  Math.random()
    .toString(36)
    .slice(2)

export default (sender: BrowserWindow, channel?: ?string) => {
  return new StreamRPC(electronTransport(sender, channel))
}

export const notifyApp = (appWindow: BrowserWindow, data: Object) => {
  data.id = generateId()
  appWindow.send('notify-app', data)
}
