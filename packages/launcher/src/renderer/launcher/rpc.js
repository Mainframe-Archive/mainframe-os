// @flow

import type { ID } from '@mainframe/client'
import electronRPC from '@mainframe/rpc-electron'

import { LAUNCHER_CHANNEL } from '../../constants'

const rpc = electronRPC(LAUNCHER_CHANNEL)

export default {
  // Apps
  getInstalledApps: () => rpc.request('app_getInstalled'),
  installApp: (manifest: Object, userID: ID, settings: Object) => {
    return rpc.request('app_install', { manifest, userID, settings })
  },
  removeApp: (appID: ID) => rpc.request('app_remove', { appID }),
  launchApp: (appID: ID, userID: ID) => {
    return rpc.request('app_launch', { appID, userID })
  },
  readManifest: (path: string) => rpc.request('app_readManifest', { path }),

  // Identity
  createUserIdentity: (data: Object) => {
    return rpc.request('identity_createUser', { data })
  },
  getOwnUserIdentities: () => rpc.request('identity_getOwnUsers'),

  // Main process
  getVaultsData: () => rpc.request('vault_getVaultsData'),
  createVault: (password: string, label: string) => {
    return rpc.request('vault_create', { password, label })
  },
  openVault: (path: string, password: string) => {
    return rpc.request('vault_open', { path, password })
  },
}
