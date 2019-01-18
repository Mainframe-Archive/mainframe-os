// @flow

import type { ManifestData, PartialManifestData } from '@mainframe/app-manifest'
import type {
  PermissionCheckResult,
  PermissionGrant,
  PermissionKey,
  PermissionsDetails,
  PermissionsRequirements,
  StrictPermissionsRequirements,
  StrictPermissionsGrants,
} from '@mainframe/app-permissions'
import type { ID } from '@mainframe/utils-id'
import type { ExecutionResult } from 'graphql'

export type { ID } from '@mainframe/utils-id'

export type WalletTypes = 'hd' | 'ledger'
export type WalletSupportedChains = 'ethereum'
export type WalletAccount = string

export type WalletResult = {
  localID: string,
  type: 'ledger' | 'hd',
  accounts: Array<{
    name: string,
    address: string,
  }>,
}

export type IdentityOwnData = {
  id: string,
  localID: string,
  profile: Object,
  ethWallets: Array<WalletResult>,
}

export type AppCheckPermissionParams = {
  sessID: ID,
  key: PermissionKey,
  input?: ?string,
}

export type AppCheckPermissionResult = {
  result: PermissionCheckResult,
}

export type AppUserPermissionsSettings = {
  grants: StrictPermissionsGrants,
  permissionsChecked: boolean,
}

export type AppCloseParams = { sessID: ID }

export type AppCreateParams = {
  contentsPath: string,
  developerID: string,
  name?: ?string,
  version?: ?string,
  permissionsRequirements?: ?StrictPermissionsRequirements,
}

export type AppCreateResult = { appID: ID }

export type WalletSettings = {
  defaultEthAccount: ?string,
}

export type AppUserSettings = {
  permissionsSettings: AppUserPermissionsSettings,
  walletSettings: WalletSettings,
}

export type AppUser = IdentityOwnData & {
  settings: AppUserSettings,
}

export type AppInstalledData = {
  localID: ID,
  manifest: ManifestData,
  users: Array<AppUser>,
  name: string,
}

export type AppOwnData = {
  localID: ID,
  manifest: ManifestData,
  users: Array<AppUser>,
  name: string,
}

export type AppGetInstalledResult = {
  apps: Array<AppInstalledData>,
}

export type AppGetAllResult = {
  own: Array<AppOwnData>,
  installed: Array<AppInstalledData>,
}

export type AppGetManifestDataParams = {
  appID: ID,
  version?: ?string,
}

export type AppGetManifestDataResult = {
  data: PartialManifestData,
}

export type AppInstallParams = {
  manifest: ManifestData,
  userID: ID,
  permissionsSettings: AppUserPermissionsSettings,
}

export type AppInstallResult = { appID: ID }

export type AppOpenParams = {
  appID: ID,
  userID: ID,
}

export type AppData = {
  appID: ID,
  manifest: ManifestData | PartialManifestData,
  contentsPath: string,
}

export type AppSession = {
  sessID: ID,
  permissions: PermissionsDetails,
}

export type AppOpenResult = {
  app: AppData,
  session: AppSession,
  user: IdentityOwnData,
  defaultEthAccount: ?string,
}

export type AppPublishContentsParams = {
  appID: ID,
  version?: ?string,
}

export type AppPublishContentsResult = {
  contentsURI: string,
}

export type AppRemoveParams = { appID: ID }

export type AppSetUserSettingsParams = {
  appID: ID,
  userID: ID,
  settings: AppUserSettings,
}

export type AppSetUserPermissionsSettingsParams = {
  appID: ID,
  userID: ID,
  settings: AppUserPermissionsSettings,
}

export type AppSetPermissionParams = {
  sessID: ID,
  key: PermissionKey,
  value: PermissionGrant,
}

export type AppSetPermissionsRequirementsParams = {
  appID: ID,
  permissions: PermissionsRequirements,
  version?: ?string,
}

export type AppWriteManifestParams = {
  appID: ID,
  path: string,
  version?: ?string,
}

// Blockchain

export type EthTransactionParams = {
  nonce: number,
  from: string,
  to: string,
  value: number,
  data: string,
  gas: string,
  gasPrice: string,
  chainId: number,
}

export type BlockchainWeb3SendParams = {
  id: number,
  jsonrpc: string,
  method: string,
  params: Array<any>,
}

export type BlockchainWeb3SendResult = any

// GraphQL

export type GraphQLQueryParams = {
  query: string,
  variables?: Object,
}

export type GraphQLQueryResult = ExecutionResult

// Identity

export type FeedHash = string

export type Feeds = {
  [type: string]: FeedHash,
}

export type IdentityAddPeerParams = {
  key: string,
  profile: {
    name?: ?string,
    avatar?: ?string,
  },
  publicFeed: string,
  firstContactAddress: string,
  otherFeeds: Feeds,
}

export type IdentityAddPeerByFeedParams = {
  feedHash: string,
}

export type IdentityPeerResult = {
  id: ID,
  publicFeed: string,
  profile: {
    name?: ?string,
    avatar?: ?string,
  },
}

export type IdentityAddPeerResult = { id: ID }

export type IdentityCreateDeveloperParams = {
  profile: {
    name: string,
    avatar?: ?string,
  },
}

export type IdentityCreateUserParams = {
  profile: {
    name: string,
    avatar?: ?string,
  },
}

export type IdentityCreateResult = { id: ID }

export type IdentityCreateContactParams = {
  userID: string,
  contactParams: {
    peerID: string,
    contactData: {
      name?: ?string,
      avatar?: ?string,
      ethAddress?: ?string,
    },
    ownFeed?: ?string,
    contactFeed?: ?string,
  },
}

export type IdentityCreateContactResult = { id: ID }

export type IdentityGetOwnDevelopersResult = {
  developers: Array<IdentityOwnData>,
}

export type IdentityGetOwnUsersResult = {
  users: Array<IdentityOwnData>,
}

export type IdentityGetPeersResult = {
  peers: Array<IdentityPeerResult>,
}

export type IdentityDeleteContactParams = {
  userID: ID,
  contactID: ID,
}

export type IdentityGetUserContactsParams = {
  userID: ID,
}

export type ContactResult = {
  localID: string,
  peerID: string,
  connectionState: 'sent' | 'connected',
  profile: {
    name?: ?string,
    avatar?: ?string,
  },
}

export type IdentityGetUserContactsResult = {
  contacts: Array<ContactResult>,
}

export type IdentityLinkEthWalletAccountParams = {
  id: ID,
  walletID: ID,
  address: string,
}

export type IdentityUnlinkEthWalletAccountParams = {
  id: ID,
  walletID: ID,
  address: string,
}

// Vaults

export type VaultParams = {
  path: string,
  password: string,
}

export type VaultSettings = {
  bzzURL: string,
  pssURL: string,
  ethURL: string,
  ethChainID: number,
}

export type VaultSettingsParams = $Shape<VaultSettings>

// Wallet

export type WalletImportMnemonicParams = {
  chain: WalletSupportedChains,
  mnemonic: string,
  name: string,
}

export type WalletNamedAccount = {
  name: string,
  address: string,
}

export type WalletImportResult = {
  localID: ID,
  type: WalletTypes,
  accounts: Array<WalletNamedAccount>,
}

export type WalletCreateHDParams = {
  chain: WalletSupportedChains,
  name: string,
}

export type WalletCreateHDResult = {
  localID: ID,
  type: WalletTypes,
  accounts: Array<WalletNamedAccount>,
  mnemonic: string,
}

export type WalletResults = Array<WalletResult>

export type WalletDeleteParams = {
  chain: string,
  type: WalletTypes,
  localID: string,
}

export type WalletGetEthWalletsResult = {
  hd: WalletResults,
  ledger: WalletResults,
}

export type WalletEthSignDataParams = {
  localID: ID,
  address: string,
  data: string,
}

export type WalletSignTxParams = {
  chain: WalletSupportedChains,
  transactionData: EthTransactionParams,
}

export type WalletSignTxResult = string

export type WalletGetLedgerEthAccountsParams = {
  pageNum: number,
}

export type WalletGetUserEthAccountsParams = {
  userID: string,
}

export type WalletGetUserEthWalletsParams = {
  userID: string,
}

export type WalletGetLedgerEthAccountsResult = Array<string>

export type WalletGetEthAccountsResult = Array<string>

export type WalletAddLedgerEthAccountParams = {
  index: number,
  name: string,
}

export type WalletAddHDAccountParams = {
  name: string,
  index: number,
  walletID: ID,
}

export type WalletAddHDAccountResult = string

export type WalletAddLedgerResult = {
  localID: string,
  address: string,
}
