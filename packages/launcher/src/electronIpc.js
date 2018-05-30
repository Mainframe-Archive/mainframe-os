// @flow

import ipc from 'electron-better-ipc'

export const callMain = (): Promise<any> => {
  return ipc.callMain('client-request')
}
