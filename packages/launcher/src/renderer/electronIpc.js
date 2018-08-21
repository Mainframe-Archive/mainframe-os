// @flow

import { ipcRenderer } from 'electron'
import type { ID } from '@mainframe/utils-id'

import request from '../ipcRequest'

const makeRequest = (method: string, args: Array<any> = []) => {
  return request(ipcRenderer, ipcRenderer, 'appToMain', method, args)
}

export const ipcClient = {
  // Apps
  getInstalledApps: () => makeRequest('getInstalledApps'),
  installApp: (manifest: Object, userId: ID, settings: Object) =>
    makeRequest('installApp', [manifest, userId, settings]),
  removeApp: (appID: ID) => makeRequest('removeApp', [appID]),
  launchApp: (appID: ID, userID: ID) =>
    makeRequest('launchApp', [appID, userID]),

  // Identity
  createUserIdentity: (identity: Object) =>
    makeRequest('createUserIdentity', [identity]),
  getOwnUserIdentities: () => makeRequest('getOwnUserIdentities'),

  // Main process
  getVaultsData: () => makeRequest('getVaultsData'),
  createVault: (password: string, label: string) =>
    makeRequest('createVault', [password, label]),
  openVault: (path: string, password: string) =>
    makeRequest('openVault', [path, password]),
}
