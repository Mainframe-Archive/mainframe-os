// @flow

import type { ManifestData, PartialManifestData } from '@mainframe/app-manifest'
import type {
  PermissionCheckResult,
  PermissionGrant,
  PermissionsGrants,
  PermissionKey,
  PermissionsDetails,
  PermissionsRequirements,
} from '@mainframe/app-permissions'
import type { ID } from '@mainframe/utils-id'

export type { ID } from '@mainframe/utils-id'

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
}

export type AppCreateResult = { appID: ID }

export type AppInstalledData = {
  appID: ID,
  manifest: ManifestData,
  users: Array<IdentityOwnData>,
}

export type AppGetInstalledResult = {
  apps: Array<AppInstalledData>,
}

export type AppGetManifestDataParams = {
  appID: ID,
  version?: ?string,
}

export type AppGetManifestDataResult = {
  data: PartialManifestData,
}

export type AppUserSettings = {
  permissions: PermissionsGrants,
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

export type AppSetPermissionParams = {
  sessID: ID,
  key: PermissionKey,
  value: PermissionGrant,
  persist?: ?boolean,
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

export type BlockchainContractABI = Array<Object>

export type BlockchainGetContractEventsParams = {
  contractAddress: string,
  abi: BlockchainContractABI,
  eventName: string,
  options?: {
    filter?: Object,
    fromBlock?: number,
    toBlock?: number,
  },
}

export type BlockchainGetContractEventsResult = Array<Object>

export type BlockchainGetLatestBlockResult = number

export type BlockchainReadContractParams = {
  contractAddress: string,
  abi: BlockchainContractABI,
  method: string,
  args?: ?Array<any>,
}

export type BlockchainReadContractResult = any

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
