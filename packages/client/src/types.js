// @flow

import type { SignBytesFunc } from '@erebos/api-bzz-base'
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
import type { base64 } from '@mainframe/utils-base64'
import type { ID } from '@mainframe/utils-id'
import type { ExecutionResult } from 'graphql'

export type { ID } from '@mainframe/utils-id'

export type WalletTypes = 'hd' | 'ledger'
export type WalletSupportedChains = 'ethereum'
export type WalletAccount = string

export type WalletResult = {
  localID: string,
  name: ?string,
  type: string,
  accounts: Array<string>,
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

export type ApprovedContact = {
  publicDataOnly: boolean,
  id: string,
  localID: string,
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

export type AppUserWalletSettings = {
  defaultEthAccount: ?string,
}

export type ContextStorageSettings = {
  address: string,
  encryptionKey: Buffer,
  contentHash: ?string,
  feedHash: ?string,
  signBytes: SignBytesFunc,
  manifestHash?: string,
}

export type StorageSettings = {
  feedHash: ?string,
  feedKey: string, // hex
  encryptionKey: base64,
}

export type AppUserSettings = {
  approvedContacts: {
    [id: string]: ApprovedContact,
  },
  permissionsSettings: AppUserPermissionsSettings,
  walletSettings: AppUserWalletSettings,
  storageSettings: StorageSettings,
}

export type AppUser = IdentityOwnData & {
  settings: AppUserSettings,
}

export type AppInstalledData = {
  localID: ID,
  mfid: ID,
  manifest: ManifestData,
  users: Array<AppUser>,
  name: string,
}

export type AppOwnData = {
  localID: ID,
  mfid: ID,
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

export type AppInstallationState =
  | 'pending'
  | 'hash_lookup'
  | 'hash_not_found'
  | 'downloading'
  | 'download_error'
  | 'ready'

export type AppInstallResult = {
  appID: ID,
  installationState: AppInstallationState,
}

export type AppLoadManifestParams = {
  hash: string,
}

export type AppLoadManifestResult = {
  appID?: ID,
  manifest: ManifestData,
  isOwn?: ?boolean,
}

export type AppOpenParams = {
  appID: ID,
  userID: ID,
}

export type AppData = {
  appID: ID,
  manifest: ManifestData | PartialManifestData,
  contentsPath: string,
}

export type AppStorage = {
  feedHash: ?string,
  feedKey: string, // hex
  encryptionKey: base64,
}

export type AppSession = {
  sessID: ID,
  permissions: PermissionsDetails,
}

export type AppOpenResult = {
  app: AppData,
  session: AppSession,
  user: IdentityOwnData,
  isDev?: ?boolean,
  defaultEthAccount: ?string,
  storage: AppStorage,
}

export type AppPublishParams = {
  appID: ID,
  version?: ?string,
}

export type AppPublishResult = {
  hash: string,
}

export type AppRemoveParams = { appID: ID }

export type AppSetUserDefaultWalletParams = {
  appID: string,
  userID: string,
  address: string,
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

export type AppSetFeedHashParams = {
  sessID: ID,
  feedHash: string,
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
  chainId?: ?number,
}

export type BlockchainEthSendParams = {|
  method: string,
  params: Array<*>,
|}

export type BlockchainEthSendResult = any

export type EthUnsubscribeParams = {
  id: string,
}

export type GetInviteTXDetailsParams = {
  type: 'approve' | 'sendInvite',
  userID: string,
  contactID: string,
}

export type GetInviteTXDetailsResult = {
  approved?: ?boolean,
  gasPriceGwei?: string,
  maxCost?: string,
  stakeAmount: string,
}

export type SendInviteTXParams = {
  userID: string,
  contactID: string,
  gasPrice?: string,
  customAddress?: string,
}

export type SendDeclineTXParams = {
  userID: string,
  peerID: string,
  gasPrice?: string,
  customAddress?: string,
}

export type SendWithdrawInviteTXParams = {
  userID: string,
  contactID: string,
  gasPrice?: string,
  customAddress?: string,
}

// Comms

export type CommsPublishParams = {
  appID: ID,
  userID: string,
  contactID: string,
  key: string,
  value: Object,
}

export type CommsSubscribeParams = {
  appID: ID,
  userID: string,
  contactID: string,
  key: string,
}

export type CommsGetSubscribableParams = {
  appID: ID,
  userID: string,
  contactID: string,
}

export type CommsGetSubscribableResult = Array<string>

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
    ethAddress?: ?string,
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
    ethAddress?: ?string,
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
    ethAddress?: ?string,
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

export type IdentityCreateContactFromPeerParams = {
  userID: string,
  peerID: string,
}

export type IdentityCreateContactFromFeedParams = {
  userID: string,
  feedHash: string,
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

export type ContactsGetAppApprovedContactsParams = {
  appID: string,
  userID: string,
}

export type ContactsGetAppUserContactsParams = {
  appID: string,
  userID: string,
  contactIDs: Array<string>,
}

export type ContactsApproveContactsForAppParams = {
  appID: string,
  userID: string,
  contactsToApprove: Array<{
    publicDataOnly: boolean,
    localID: string,
  }>,
}

export type ContactProfile = {
  name?: ?string,
  avatar?: ?string,
  ethAddress?: ?string,
}

export type AppUserContact = {
  id: string,
  data: ?{
    profile: ContactProfile,
  },
}

export type ContactsApproveContactsForAppResult = {
  approvedContacts: Array<AppUserContact>,
}

export type ContactsGetAppUserContactsResult = {
  contacts: Array<AppUserContact>,
}

export type ContactResult = {
  localID: string,
  peerID: string,
  connectionState:
    | 'connected'
    | 'sent_feed'
    | 'sending_feed'
    | 'received'
    | 'declined'
    | 'sending_blockchain'
    | 'sent_blockchain',
  profile: ContactProfile,
  invite?: {
    inviteTX: string,
    stake: {
      amount: string,
      state: 'sending' | 'staked' | 'reclaiming' | 'reclaimed' | 'seized',
      reclaimedTX?: ?string,
    },
  },
}

export type ContactsGetUserContactsParams = {
  userID: string,
}

export type ContactsGetUserContactsResult = {
  contacts: Array<ContactResult>,
}

export type IdentityUpdateUserParams = {
  userID: string,
  profile: {
    name?: string,
    avatar?: ?string,
    ethAddress?: ?string,
  },
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
}

export type VaultSettingsParams = $Shape<VaultSettings>

// Wallet

export type WalletImportMnemonicParams = {
  blockchain: WalletSupportedChains,
  mnemonic: string,
  name: string,
  userID?: string,
}

export type WalletImportResult = {
  localID: ID,
  accounts: Array<string>,
}

export type WalletCreateHDParams = {
  blockchain: WalletSupportedChains,
  name: string,
  userID?: string,
}

export type WalletCreateHDResult = {
  localID: ID,
  accounts: Array<string>,
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

export type WalletEthSignTxParams = EthTransactionParams

export type WalletSignTxResult = string

export type WalletEthSignParams = {
  address: string,
  data: string,
}

export type WalletSignResult = string

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

export type WalletAddLedgerEthAccountsParams = {
  indexes: Array<number>,
  name: string,
  userID?: string,
}

export type WalletAddHDAccountParams = {
  index: number,
  walletID: string,
  userID?: string,
}

export type WalletAddHDAccountResult = string

export type WalletAddLedgerResult = {
  localID: string,
  addresses: Array<string>,
}

export type WalletSetUserDefaulParams = {
  userID: string,
  address: string,
}
