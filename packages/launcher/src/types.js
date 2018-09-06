// @flow

import type Client, { ID, AppOpenResult } from '@mainframe/client'
import type { BrowserWindow } from 'electron'

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

export type AppSessions = {
  [appID: ID]: {
    [userID: ID]: AppSession,
  },
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
