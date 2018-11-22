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

export type { ID } from '@mainframe/utils-id'

export type WalletTypes = 'hd' | 'pk' | 'ledger'
export type WalletSupportedChains = 'ethereum'
export type WalletAccount = string
export type IdentityOwnData = {
  id: ID,
  data: Object,
  ethWallets: { [walletID: ID]: Array<WalletAccount> },
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
  developerID?: ?ID,
  name?: ?string,
  version?: ?string,
  permissionsRequirements?: ?StrictPermissionsRequirements,
}

export type AppCreateResult = { appID: ID }

export type AppInstalledData = {
  appID: ID,
  manifest: ManifestData,
  users: Array<IdentityOwnData>,
}

export type AppOwnData = {
  appID: ID,
  manifest: ManifestData,
  users: Array<IdentityOwnData>,
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

export type WalletSettings = {
  defaultEthAccount: ?string,
}
export type AppUserSettings = {
  permissionsSettings: AppUserPermissionsSettings,
  walletSettings: WalletSettings,
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

export type AppRemoveOwnParams = { appID: ID }

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
  transactionParams: EthTransactionParams,
  walletID: ID,
}

export type BlockchainWeb3SendResult = any

// Wallet

export type WalletImportMnemonicParams = {
  chain: WalletSupportedChains,
  mnemonic: string,
}

export type WalletImportPKParams = {
  chain: WalletSupportedChains,
  privateKey: string,
  walletID?: ID,
}

export type WalletResult = {
  walletID: ID,
  type: WalletTypes,
  accounts: Array<string>,
}

export type WalletImportResult = WalletResult

export type WalletCreateHDParams = {
  chain: WalletSupportedChains,
}

export type WalletCreateHDResult = {
  walletID: ID,
  type: WalletTypes,
  accounts: Array<string>,
  mnemonic: string,
}

export type WalletResults = Array<WalletResult>

export type WalletDeleteParams = {
  chain: string,
  type: WalletTypes,
  walletID: ID,
}

export type WalletGetEthWalletsResult = {
  hd: WalletResults,
  simple: WalletResults,
  ledger: WalletResults,
}

export type WalletEthSignDataParams = {
  walletID: ID,
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

export type WalletGetLedgerEthAccountsResult = Array<string>

export type WalletAddLedgerEthAccountParams = {
  index: number,
}

export type WalletAddHDAccountParams = {
  index: number,
  walletID: ID,
}

export type WalletAddHDAccountResult = string

// Identity

export type PublicFeedTypes = 'public'

export type FeedHash = string

export type PublicFeeds = {
  [type: PublicFeedTypes]: FeedHash,
}

export type IdentityAddPeerByKeyParams = {
  key: string,
  data: {
    name: string,
    avatar?: ?string,
  },
  feeds: PublicFeeds,
}

export type IdentityPeerResult = {
  id: ID,
  name: string,
  avatar: ?string,
}

export type IdentityAddPeerByKeyResult = { id: ID }

export type IdentityCreateDeveloperParams = {
  data?: Object,
}

export type IdentityCreateUserParams = {
  data?: Object,
}

export type IdentityCreateResult = { id: ID }

export type IdentityGetOwnDevelopersResult = {
  developers: Array<IdentityOwnData>,
}

export type IdentityGetOwnUsersResult = {
  users: Array<IdentityOwnData>,
}

export type IdentityGetPeersResult = {
  peers: Array<IdentityPeerResult>,
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
