// @flow

import { ipcRenderer } from 'electron'
import type { ID } from '@mainframe/utils-id'

const generateId = () =>
  Math.random()
    .toString(36)
    .slice(2)

export const launcherToDaemonRequestChannel =
  'ipc-launcher-daemon-request-channel'
export const launcherFromDaemonResponseChannel =
  'ipc-launcher-daemon-response-channel'

export const mainProcRequestChannel = 'ipc-main-request-channel'
export const mainProcResponseChannel = 'ipc-main-response-channel'

const callMain = (requestChan, responseChan, data) =>
  new Promise((resolve, reject) => {
    const request = {
      id: generateId(),
      data,
    }
    const listener = (event, msg) => {
      if (msg.id === request.id) {
        if (msg.error) {
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

export const callMainProcess = (method: string, args?: Array<any>) =>
  callMain(mainProcRequestChannel, mainProcResponseChannel, {
    method,
    args,
  })

const callMainClient = (method: string, args?: Array<any>) =>
  callMain(launcherToDaemonRequestChannel, launcherFromDaemonResponseChannel, {
    method,
    args,
  })

export const client = {
  // Apps
  getInstalledApps: () => callMainClient('getInstalledApps'),
  installApp: (manifest: Object, userId: ID, settings: Object) =>
    callMainClient('installApp', [manifest, userId, settings]),
  removeApp: (appID: ID) => callMainClient('removeApp', [appID]),
  openApp: (appID: ID, userID: ID) =>
    callMainClient('openApp', [appID, userID]),

  // Identity
  createUserIdentity: (identity: Object) =>
    callMainClient('createUserIdentity', [identity]),
  getOwnUserIdentities: () => callMainClient('getOwnUserIdentities'),

  // Main process
  getVaultsData: () => callMainProcess('getVaultsData'),
  createVault: (password: string, label: string) =>
    callMainProcess('createVault', [password, label]),
  openVault: (path: string, password: string) =>
    callMainProcess('openVault', [path, password]),
}
