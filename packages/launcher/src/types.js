// @flow

import type Client, { AppOpenResult as ClientSession } from '@mainframe/client'
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

export type AppSessions = {
  [window: BrowserWindow]: ClientSession,
}

// Request

export type ClientResponse = {
  id: string,
  error?: Object,
  result?: Object,
}

export type RequestContext = {
  request: Object,
  appSession: ClientSession,
  window: BrowserWindow,
  client: Client,
}

export type Notification = {
  id: string,
  type: string,
  data: Object,
}
