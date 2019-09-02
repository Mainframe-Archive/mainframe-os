// @flow

import type {
  WebDomainDefinition,
  WebDomainsDefinitions,
} from './main/db/schemas/appManifest'
import type { GenericProfileData } from './main/db/schemas/genericProfile'

export type {
  WebDomainDefinition,
  WebDomainsDefinitions,
} from './main/db/schemas/appManifest'

export type ReadOnlyWebDomainDefinition = $ReadOnly<WebDomainDefinition>
export type ReadOnlyWebDomainsDefinitions = $ReadOnlyArray<ReadOnlyWebDomainDefinition>

// UI

type StyleObject = { [key: string]: string | number }
export type Style =
  | void
  | number
  | StyleObject
  | Array<void | number | StyleObject>

// App

export type AppData = {
  contentsPath: string,
  profile: GenericProfileData,
  publicID: string,
}

export type AppWallet = {
  name: string,
  localID: string,
  accounts: Array<string>,
}

export type AppWallets = {
  hd: Array<AppWallet>,
  ledger: Array<AppWallet>,
  defaultAccount: ?string,
}

export type AppWindowSession = {
  app: {
    contentsURL: string,
    profile: GenericProfileData,
    publicID: string,
  },
  isDevelopment: boolean,
  partition: string,
  settings: {
    defaultWalletAddress: ?string,
    webDomains: WebDomainsDefinitions,
  },
  user: {
    id: string,
    profile: GenericProfileData,
    walletAddresses: Array<string>,
  },
}

// Request

// export type ClientResponse = {
//   id: string,
//   error?: Object,
//   result?: Object,
// }

// export type RequestContext = {
//   request: Object,
//   appSession: AppSession,
//   window: BrowserWindow,
//   client: Client,
// }

// RPC

export type ContactGetInviteTXDetailsParams = {|
  type: string,
  contactID: string,
  customAddress: string,
|}

export type DBRequestParams = {| password: string, save?: ?boolean |}

export type DBOpenResult = {| user: boolean, wallet: boolean |}

export type GraphQLRequestParams = {| query: string, variables?: ?Object |}

export type UserCreateRequestParams = {|
  profile: { name: string },
  isPrivate: boolean,
|}

export type WalletGetLedgerEthAccountsParams = {|
  pageNum: number,
  legacyPath: boolean,
|}
