// @flow

import { ipcRenderer } from 'electron'
import type { ID } from '@mainframe/utils-id'

const generateId = () =>
  Math.random()
    .toString(36)
    .slice(2)

export const trustedRequestChannel = 'ipc-trusted-request-channel'
export const trustedResponseChannel = 'ipc-trusted-response-channel'

const request = (method, args) =>
  new Promise((resolve, reject) => {
    const request = {
      id: generateId(),
      data: {
        method,
        args,
      },
    }
    const listener = (event, msg) => {
      if (msg.id === request.id) {
        if (msg.error) {
          reject(msg.error)
        } else {
          resolve(msg.result)
        }
        ipcRenderer.removeListener(trustedResponseChannel, listener)
      }
    }
    ipcRenderer.on(trustedResponseChannel, listener)
    ipcRenderer.send(trustedRequestChannel, request)
  })

export const ipcClient = {
  // Apps
  getInstalledApps: () => request('getInstalledApps'),
  installApp: (manifest: Object, userId: ID, settings: Object) =>
    request('installApp', [manifest, userId, settings]),
  removeApp: (appID: ID) => request('removeApp', [appID]),
  launchApp: (appID: ID, userID: ID) => request('launchApp', [appID, userID]),
  readManifest: (path: string) => request('readManifest', [path]),

  // Identity
  createUserIdentity: (identity: Object) =>
    request('createUserIdentity', [identity]),
  getOwnUserIdentities: () => request('getOwnUserIdentities'),

  // Main process
  getVaultsData: () => request('getVaultsData'),
  createVault: (password: string, label: string) =>
    request('createVault', [password, label]),
  openVault: (path: string, password: string) =>
    request('openVault', [path, password]),
}
