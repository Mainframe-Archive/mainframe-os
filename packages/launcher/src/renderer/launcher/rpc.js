// @flow

import type {
  ID,
  AppCreateParams,
  AppUserSettings,
  AppUserPermissionsSettings,
} from '@mainframe/client'
import electronRPC from '@mainframe/rpc-electron'

import { LAUNCHER_CHANNEL } from '../../constants'

const rpc = electronRPC(LAUNCHER_CHANNEL)

export default {
  // Apps
  getApps: () => rpc.request('app_getAll'),
  installApp: (
    manifest: Object,
    userID: ID,
    permissionsSettings: AppUserPermissionsSettings,
  ) => {
    return rpc.request('app_install', { manifest, userID, permissionsSettings })
  },
  createApp: (appInfo: AppCreateParams) => rpc.request('app_create', appInfo),
  removeApp: (appID: ID) => rpc.request('app_remove', { appID }),
  removeOwnApp: (appID: ID) => rpc.request('app_removeOwn', { appID }),
  launchApp: (appID: ID, userID: ID) => {
    return rpc.request('app_launch', { appID, userID })
  },
  readManifest: (path: string) => rpc.request('app_readManifest', { path }),
  setAppUserSettings: (appID: ID, userID: ID, settings: AppUserSettings) => {
    rpc.request('app_setUserSettings', { appID, userID, settings })
  },
  setAppUserPermissionsSettings: (
    appID: ID,
    userID: ID,
    settings: AppUserPermissionsSettings,
  ) => {
    rpc.request('app_setUserPermissionsSettings', { appID, userID, settings })
  },

  // Identity
  createUserIdentity: (data: Object) => {
    return rpc.request('identity_createUser', { data })
  },
  createDeveloperIdentity: (data: Object) => {
    return rpc.request('identity_createDeveloper', { data })
  },
  getOwnUserIdentities: () => rpc.request('identity_getOwnUsers'),
  getOwnDevIdentities: () => rpc.request('identity_getOwnDevelopers'),

  // Main process
  getVaultsData: () => rpc.request('vault_getVaultsData'),
  createVault: (password: string, label: string) => {
    return rpc.request('vault_create', { password, label })
  },
  openVault: (path: string, password: string) => {
    return rpc.request('vault_open', { path, password })
  },

  // Wallets
  importWalletFromMnemonic: (mnemonic: string) =>
    rpc.request('wallet_importMnemonic', {
      mnemonic,
      chain: 'ethereum',
    }),
  createEthWallet: () => rpc.request('wallet_createEth'),
}
