// @flow
import { ipcMain } from 'electron'

import request, { ipcNotify } from '../ipcRequest'

export default (sender: Object, method: string, args: Array<any>) => {
  return request(sender, ipcMain, 'mainToApp', method, args)
}

export const notifyApp = (sender: Object, data: Object) =>
  ipcNotify(sender, 'mainToApp', data)
