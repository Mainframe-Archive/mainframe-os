// @flow

const ipc = require('electron-better-ipc')

const generateId = () =>
  Math.random()
    .toString(36)
    .slice(2)

export const callMain = (method: string, params: Array<any>): Promise<any> => {
  const request = {
    id: generateId(),
    data: {
      method,
      args: params,
    },
  }
  return ipc.callMain('client-request', request)
}

export const callMainClient = {
  createApp: (app: Object) => callMain('createApp', [app]),
}
