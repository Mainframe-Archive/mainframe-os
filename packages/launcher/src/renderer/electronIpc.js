// @flow

import { ipcRenderer } from 'electron'
import type { ID } from '@mainframe/utils-id'

type App = {
  userID: ID,
  manifest: Object,
  settings: Object,
}

const generateId = () =>
  Math.random()
    .toString(36)
    .slice(2)

const clientRequestChannel = 'ipc-launcher-client-request-channel'
const clientResponseChannel = 'ipc-launcher-client-response-channel'

const callMain = (requestChan, responseChan, data) =>
  new Promise((resolve, reject) => {
    const request = {
      id: generateId(),
      data,
    }
    const listener = (event, msg) => {
      if (msg.id === request.id) {
        if (msg.error || !msg.result) {
          reject(msg.error)
        } else {
          resolve(msg.result)
        }
        ipcRenderer.removeListener(responseChan, listener)
      }
    }
    ipcRenderer.on(responseChan, listener)
    ipcRenderer.send(requestChan, request)
  })

const callMainClient = (method, args) =>
  callMain(clientRequestChannel, clientResponseChannel, {
    method,
    args,
  })

export const client = {
  installApp: (manifest: Object, userId: ID, settings: Object) =>
    callMainClient('installApp', [manifest, userId, settings]),
  createUserIdentity: (identity: Object) =>
    callMainClient('createUserIdentity', [identity]),
  getOwnUserIdentities: () => callMainClient('getOwnUserIdentities'),
}
