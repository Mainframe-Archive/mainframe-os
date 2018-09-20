// @flow

import type { ID, AppUserSettings, AppCreateParams } from '@mainframe/client'
import electronRPC from '@mainframe/rpc-electron'

const rpc = electronRPC('rpc-trusted')

export default {
  // Apps
  getApps: () => rpc.request('getApps'),
  createApp: (appInfo: AppCreateParams) => rpc.request('createApp', appInfo),
  installApp: (manifest: Object, userID: ID, settings: Object) => {
    return rpc.request('installApp', { manifest, userID, settings })
  },
  removeApp: (appID: ID) => rpc.request('removeApp', { appID }),
  removeOwnApp: (appID: ID) => rpc.request('removeOwnApp', { appID }),
  launchApp: (appID: ID, userID: ID) => {
    return rpc.request('launchApp', { appID, userID })
  },
  readManifest: (path: string) => rpc.request('readManifest', { path }),
  setAppUserSettings: (appID: ID, userID: ID, settings: AppUserSettings) => {
    rpc.request('setAppUserSettings', { appID, userID, settings })
  },
  // Identity
  createDeveloperIdentity: (data: Object) => {
    return rpc.request('createDeveloperIdentity', { data })
  },
  createUserIdentity: (data: Object) => {
    return rpc.request('createUserIdentity', { data })
  },
  getOwnDevIdentities: () => rpc.request('getOwnDevIdentities'),
  getOwnUserIdentities: () => rpc.request('getOwnUserIdentities'),

  // Main process
  getVaultsData: () => rpc.request('getVaultsData'),
  createVault: (password: string, label: string) => {
    return rpc.request('createVault', { password, label })
  },
  openVault: (path: string, password: string) => {
    return rpc.request('openVault', { path, password })
  },
}
