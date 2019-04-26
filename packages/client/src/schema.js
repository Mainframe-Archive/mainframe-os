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

export const APP_LOAD_MANIFEST_SCHEMA = {
  hash: 'string',
}

export const APP_OPEN_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  userID: LOCAL_ID_SCHEMA,
}

export const APP_PUBLISH_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const APP_REMOVE_OWN_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
}

export const APP_REMOVE_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
}

export const APP_SET_PERMISSION_SCHEMA = {
  sessID: LOCAL_ID_SCHEMA,
  key: PERMISSION_KEY_SCHEMA,
  value: PERMISSION_GRANT_SCHEMA,
  persist: { type: 'boolean', optional: true },
}

export const APP_SET_USER_DEFAULT_WALLET_SCHEMA = {
  appID: 'string',
  userID: 'string',
  address: 'string',
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

export const APP_SET_FEED_HASH_SCHEMA = {
  sessID: LOCAL_ID_SCHEMA,
  feedHash: 'string',
}

export const COMMS_PUBLISH_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  contactID: LOCAL_ID_SCHEMA,
  key: 'string',
  value: 'object',
}

export const COMMS_SUBSCRIBE_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  contactID: LOCAL_ID_SCHEMA,
  key: 'string',
}

export const COMMS_GET_SUBSCRIBABLE_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  contactID: LOCAL_ID_SCHEMA,
}

export const CONTACT_GET_APP_USER_CONTACTS_SCHEMA = {
  contactIDs: {
    type: 'array',
    items: 'string',
  },
}

export const CONTACT_GET_APP_APPROVED_CONTACTS_SCHEMA = {
  appID: 'string',
}

export const CONTACT_APPROVE_CONTACTS_FOR_APP_SCHEMA = {
  contactsToApprove: {
    type: 'array',
    items: {
      type: 'object',
      props: {
        publicDataOnly: {
          type: 'boolean',
        },
        localID: 'string',
      },
    },
  },
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

export const IDENTITY_CREATE_CONTACT_FROM_PEER_SCHEMA = {
  userID: 'string',
  peerID: 'string',
}

export const IDENTITY_CREATE_CONTACT_FROM_FEED_SCHEMA = {
  userID: 'string',
  feedHash: 'string',
}

export const IDENTITY_DELETE_CONTACT_SCHEMA = {
  userID: LOCAL_ID_SCHEMA,
  contactID: LOCAL_ID_SCHEMA,
}

export const CONTACT_GET_USER_CONTACTS_SCHEMA = {
  userID: LOCAL_ID_SCHEMA,
}

export const IDENTITY_UPDATE_USER_SCHEMA = {
  userID: 'string',
  profile: {
    type: 'object',
    props: {
      name: { type: 'string', optional: true },
      avatar: { type: 'string', optional: true },
    },
  },
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

export const WALLET_SUPPORTED_CHAIN_SCHEMA = {
  type: 'enum',
  values: ['ethereum'],
}

export const WALLET_CREATE_HD_SCHEMA = {
  blockchain: WALLET_SUPPORTED_CHAIN_SCHEMA,
}

export const WALLET_TYPE_SCHEMA = {
  type: 'enum',
  values: ['hd', 'simple', 'ledger'],
}

export const WALLET_IMPORT_MNEMONIC_SCHEMA = {
  mnemonic: 'string',
}

export const WALLET_DELETE_SCHEMA = {
  blockchain: WALLET_SUPPORTED_CHAIN_SCHEMA,
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
  nonce: 'string',
  from: 'string',
  to: { type: 'string', optional: true },
  gas: 'string',
  gasPrice: 'string',
  data: { type: 'string', optional: true },
  value: { type: 'string', optional: true },
}

export const ETH_REQUEST_SCHEMA = {
  id: 'number',
  jsonrpc: 'string',
  method: 'string',
  params: { type: 'array', items: 'any' },
}

export const INVITE_TX_DETAILS_SCHEMA = {
  type: {
    type: 'enum',
    values: ['approve', 'sendInvite', 'retrieveStake', 'declineInvite'],
  },
  userID: 'string',
  contactID: 'string',
}

export const INVITE_SEND_SCHEMA = {
  userID: 'string',
  contactID: 'string',
}

export const DECLINE_INVITE_SCHEMA = {
  userID: 'string',
  peerID: 'string',
}

export const WALLET_SIGN_ETH_TRANSACTION_SCHEMA = ETH_TRANSACTION_SCHEMA

export const WALLET_GET_USER_ETH_ACCOUNTS_SCHEMA = {
  userID: 'string',
}

export const WALLET_GET_USER_ETH_WALLETS_SCHEMA = {
  userID: 'string',
}

export const WALLET_SET_USER_DEFAULT_SCHEMA = {
  userID: 'string',
  address: 'string',
}

export const WALLET_SIGN_ETH_SCHEMA = {
  address: 'string',
  data: 'string',
}
