// @flow

import type Client, { ID, AppOpenResult } from '@mainframe/client'
import type { BrowserWindow } from 'electron'

// UI

type StyleObject = { [key: string]: string | number }
export type Style =
  | void
  | number
  | StyleObject
  | Array<void | number | StyleObject>

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
    [userID: string]: AppSession,
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
