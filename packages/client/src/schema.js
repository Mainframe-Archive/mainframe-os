// @flow

import { MANIFEST_SCHEMA, SEMVER_SCHEMA } from '@mainframe/app-manifest'
import {
  PERMISSION_KEY_SCHEMA,
  PERMISSION_GRANT_SCHEMA,
  PERMISSIONS_GRANTS_SCHEMA,
  PERMISSIONS_REQUIREMENTS_SCHEMA,
} from '@mainframe/app-permissions'

export { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'

export const OPTIONAL_SEMVER_SCHEMA = { ...SEMVER_SCHEMA, optional: true }
export const OPTIONAL_PERMISSIONS_REQUIREMENTS_SCHEMA = {
  ...PERMISSIONS_REQUIREMENTS_SCHEMA,
  optional: true,
}

export const LOCAL_ID_SCHEMA = {
  type: 'string',
  length: 21, // nanoid generates 21-chars long strings
}

export const OPTIONAL_LOCAL_ID_SCHEMA = { ...LOCAL_ID_SCHEMA, optional: true }

export const APP_CHECK_PERMISSION_SCHEMA = {
  sessID: LOCAL_ID_SCHEMA,
  key: PERMISSION_KEY_SCHEMA,
  input: { type: 'string', optional: true, empty: false },
}

export const APP_CLOSE_SCHEMA = {
  sessID: LOCAL_ID_SCHEMA,
}

export const APP_CREATE_SCHEMA = {
  contentsPath: 'string',
  developerID: LOCAL_ID_SCHEMA,
  name: 'string',
  version: OPTIONAL_SEMVER_SCHEMA,
  permissions: OPTIONAL_PERMISSIONS_REQUIREMENTS_SCHEMA,
}

export const APP_GET_MANIFEST_DATA_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const APP_PERMISSIONS_SETTINGS_SCHEMA = {
  type: 'object',
  props: {
    grants: PERMISSIONS_GRANTS_SCHEMA,
    permissionsChecked: 'boolean',
  },
}

export const APP_INSTALL_SCHEMA = {
  manifest: MANIFEST_SCHEMA,
  userID: LOCAL_ID_SCHEMA,
  permissionsSettings: APP_PERMISSIONS_SETTINGS_SCHEMA,
}

export const APP_OPEN_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  userID: LOCAL_ID_SCHEMA,
}

export const APP_PUBLISH_CONTENTS_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const APP_REMOVE_OWN_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
}

export const APP_REMOVE_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
}

export const APP_SET_USER_SETTINGS_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  userID: LOCAL_ID_SCHEMA,
  settings: {
    type: 'object',
    props: {
      permissionsSettings: APP_PERMISSIONS_SETTINGS_SCHEMA,
      walletSettings: {
        type: 'object',
        props: {
          defaultEthAccount: 'string',
        },
      },
    },
  },
}

export const APP_SET_PERMISSION_SCHEMA = {
  sessID: LOCAL_ID_SCHEMA,
  key: PERMISSION_KEY_SCHEMA,
  value: PERMISSION_GRANT_SCHEMA,
  persist: { type: 'boolean', optional: true },
}

export const APP_SET_USER_PERMISSIONS_SETTINGS_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  userID: LOCAL_ID_SCHEMA,
  settings: APP_PERMISSIONS_SETTINGS_SCHEMA,
}

export const APP_SET_PERMISSIONS_REQUIREMENTS_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  permissions: PERMISSIONS_REQUIREMENTS_SCHEMA,
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const APP_WRITE_MANIFEST_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  path: 'string',
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const GRAPHQL_QUERY_SCHEMA = {
  query: 'string',
  variables: {
    type: 'object',
    optional: true,
  },
}

export const IDENTITY_CREATE_OWN_USER_SCHEMA = {
  profile: {
    type: 'object',
    props: {
      name: 'string',
      avatar: { type: 'string', optional: true },
    },
  },
}

export const IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA = {
  profile: {
    type: 'object',
    props: {
      name: 'string',
      avatar: { type: 'string', optional: true },
    },
  },
}

export const IDENTITY_PUBLIC_FEEDS_SCHEMA = {
  type: 'object',
  optional: true,
  props: {
    public: { type: 'string', optional: true },
  },
}

export const IDENTITY_ADD_PEER_SCHEMA = {
  mfid: 'string',
  publicFeed: 'string',
  profile: {
    type: 'object',
    props: {
      name: { type: 'string', optional: true },
      avatar: { type: 'string', optional: true },
    },
  },
  otherFeeds: IDENTITY_PUBLIC_FEEDS_SCHEMA,
}

export const IDENTITY_ADD_PEER_BY_FEED_SCHEMA = {
  feedHash: 'string',
}

export const IDENTITY_DELETE_CONTACT_SCHEMA = {
  userID: LOCAL_ID_SCHEMA,
  contactID: LOCAL_ID_SCHEMA,
}

export const IDENTITY_GET_USER_CONTACTS_SCHEMA = {
  userID: LOCAL_ID_SCHEMA,
}

export const IDENTITY_LINK_ETH_WALLET_SCHEMA = {
  id: LOCAL_ID_SCHEMA,
  localID: LOCAL_ID_SCHEMA,
  address: 'string',
}

export const IDENTITY_UNLINK_ETH_WALLET_SCHEMA = {
  id: LOCAL_ID_SCHEMA,
  localID: LOCAL_ID_SCHEMA,
  address: 'string',
}

export const VAULT_SCHEMA = {
  path: 'string',
  password: 'string',
}

const VAULT_SETTING_SCHEMA = { type: 'string', empty: false, optional: true }

export const VAULT_SETTINGS_SCHEMA = {
  bzzURL: VAULT_SETTING_SCHEMA,
  pssURL: VAULT_SETTING_SCHEMA,
  ethURL: VAULT_SETTING_SCHEMA,
}

export const WALLET_CREATE_HD_SCHEMA = {
  chain: 'string',
}

export const WALLET_TYPE_SCHEMA = {
  type: 'enum',
  values: ['hd', 'simple', 'ledger'],
}

export const WALLET_SUPPORTED_CHAIN_SCHEMA = {
  type: 'enum',
  values: ['ethereum'],
}

export const WALLET_IMPORT_MNEMONIC_SCHEMA = {
  mnemonic: 'string',
}

export const WALLET_DELETE_SCHEMA = {
  chain: WALLET_SUPPORTED_CHAIN_SCHEMA,
  type: WALLET_TYPE_SCHEMA,
  localID: LOCAL_ID_SCHEMA,
}

export const WALLET_GET_LEDGER_ETH_ACCOUNTS_SCHEMA = {
  pageNum: 'number',
}

export const WALLET_ADD_LEDGER_ETH_ACCOUNT_SCHEMA = {
  index: 'number',
  name: 'string',
}

export const WALLET_ADD_HD_ACCOUNT_SCHEMA = {
  localID: 'string',
  index: 'number',
}

export const ETH_TRANSACTION_SCHEMA = {
  nonce: 'number',
  from: 'string',
  to: 'string',
  data: 'string',
  gas: 'string',
  gasPrice: 'string',
}

export const ETH_REQUEST_SCHEMA = {
  id: 'number',
  jsonrpc: 'string',
  method: 'string',
  params: { type: 'array', items: 'any' },
}

export const WALLET_SIGN_ETH_TRANSACTION_SCHEMA = ETH_TRANSACTION_SCHEMA

export const WALLET_SIGN_TRANSACTION_SCHEMA = {
  chain: WALLET_SUPPORTED_CHAIN_SCHEMA,
  transactionData: 'object',
}

export const WALLET_GET_USER_ETH_ACCOUNTS_SCHEMA = {
  userID: 'string',
}

export const WALLET_GET_USER_ETH_WALLETS_SCHEMA = {
  userID: 'string',
}
