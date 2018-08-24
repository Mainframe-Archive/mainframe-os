// @flow

import type Client, { AppOpenResult } from '@mainframe/client'
import type { BrowserWindow } from 'electron'
import type StreamRPC from '@mainframe/rpc-stream'

// UI

export type Style = ?number | ?Array<Style> | ?Object

// Vault

export type VaultPath = string
export type VaultLabel = string

export type VaultsData = {
  vaults: { [VaultPath]: VaultLabel },
  defaultVault: VaultPath,
  vaultOpen: boolean,
}

// Main

export type AppSession = AppOpenResult

export type ActiveApp = {
  appSession: AppSession,
  rpc: StreamRPC,
}

export type ActiveApps = {
  [window: BrowserWindow]: ActiveApp,
}

// Request

export type ClientResponse = {
  id: string,
  error?: Object,
  result?: Object,
}

export type RequestContext = {
  request: Object,
  appSession: AppSession,
  window: BrowserWindow,
  client: Client,
}

export type Notification = {
  id: string,
  type: string,
  data: Object,
}
