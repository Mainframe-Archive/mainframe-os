// @flow

import type { ID } from '@mainframe/client'
import electronRPC from '@mainframe/rpc-electron'

const rpc = electronRPC('rpc-trusted')

export const ipcClient = {
  // Apps
  getInstalledApps: () => rpc.request('getInstalledApps'),
  installApp: (manifest: Object, userID: ID, settings: Object) =>
    rpc.request('installApp', { manifest, userID, settings }),
  removeApp: (appID: ID) => rpc.request('removeApp', { appID }),
  launchApp: (appID: ID, userID: ID) =>
    rpc.request('launchApp', { appID, userID }),
  readManifest: (path: string) => rpc.request('readManifest', { path }),

  // Identity
  createUserIdentity: (data: Object) =>
    rpc.request('createUserIdentity', { data }),
  getOwnUserIdentities: () => rpc.request('getOwnUserIdentities'),

  // Main process
  getVaultsData: () => rpc.request('getVaultsData'),
  createVault: (password: string, label: string) =>
    rpc.request('createVault', { password, label }),
  openVault: (path: string, password: string) =>
    rpc.request('openVault', { path, password }),
}
