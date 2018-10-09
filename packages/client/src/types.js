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

export type IdentityOwnData = { id: ID, data: Object }

export type AppCheckPermissionParams = {
  sessID: ID,
  key: PermissionKey,
  input?: ?string,
}

export type AppCheckPermissionResult = {
  result: PermissionCheckResult,
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

export type AppUserSettings = {
  permissions: StrictPermissionsGrants,
  permissionsChecked: boolean,
}

export type AppInstallParams = {
  manifest: ManifestData,
  userID: ID,
  settings: AppUserSettings,
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

export type BlockchainWeb3SendParams = {
  transactionParams: Object, // TODO: define
  walletID: ID,
}

export type BlockchainWeb3SendResult = any

// Wallet

export type WalletCreateHDParams = {
  chain: WalletSupportedChains,
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

export type WalletImportPKResult = WalletResult

export type WalletCreateHDResult = WalletResult

export type WalletResults = Array<WalletResult>

export type WalletGetEthWalletsResult = {
  hd: WalletResults,
  simple: WalletResults,
  ledger: WalletResults,
}

export type EthTransactionParams = {
  nonce: number,
  from: string,
  to: string,
  value: number,
  data: string,
  gasLimit: number,
  gasPrice: number,
  chainId: string,
}

export type WalletEthSignTransactionParams = {
  walletID: ID,
  walletType: WalletTypes,
  transactionData: EthTransactionParams,
}

export type WalletEthSignDataParams = {
  walletID: ID,
  address: string,
  data: string,
}

export type WalletEthSignTransactionResult = string

export type WalletSignTxParams = {
  walletID: ID,
  chain: WalletSupportedChains,
  transactionParams: Object, // TODO: define
}

export type WalletSignTxResult = string

// Identity

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

export type VaultParams = {
  path: string,
  password: string,
}

export type VaultSettings = {
  bzzURL: string,
  pssURL: string,
  web3HTTPProvider: string,
}

export type VaultSettingsParams = $Shape<VaultSettings>
