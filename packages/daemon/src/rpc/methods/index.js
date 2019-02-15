// @flow

import * as app from './app'
import * as blockchain from './blockchain'
import * as comms from './comms'
import * as contact from './contact'
import * as graphql from './graphql'
import * as identity from './identity'
import * as sub from './subscription'
import * as vault from './vault'
import * as wallet from './wallet'

const noop = () => {}

export default {
  api_version: () => 0.1,

  app_checkPermission: app.checkPermission,
  app_close: app.close,
  app_create: app.create,
  app_getAll: app.getAll,
  app_getManifestData: app.getManifestData,
  app_install: app.install,
  app_loadManifest: app.loadManifest,
  app_open: app.open,
  app_publish: app.publish,
  app_remove: app.remove,
  app_setPermission: app.setPermission,
  app_setPermissionsRequirements: app.setPermissionsRequirements,
  app_setUserDefaultWallet: app.setUserDefaultWallet,
  app_setUserPermissionsSettings: app.setUserPermissionsSettings,
  // TODO: remove app for given user only
  // Options:
  // - "clear": removes app contents, only possible if there is no user left for app
  // - "remove": clear + also removes manifest, no more knowledge about this app in vault
  app_uninstall: noop,
  app_update: noop, // TODO: similar to install

  blockchain_web3Send: blockchain.web3Send,
  blockchain_subEthNetworkChanged: blockchain.subEthNetworkChanged,

  comms_publish: comms.publish,
  comms_subscribe: comms.subscribe,
  comms_getSubscribable: comms.getSubscribable,

  contact_approveContacts: contact.approveContactsForApp,
  contact_getAppApprovedContacts: contact.getAppApprovedContacts,
  contact_getAppUserContacts: contact.getAppUserContacts,
  contact_getUserContacts: contact.getUserContacts,

  graphql_query: graphql.query,
  graphql_subscription: graphql.subscription,

  identity_addPeer: identity.addPeer,
  identity_addPeerByFeed: identity.addPeerByFeed,
  identity_createContactFromFeed: identity.createContactFromFeed,
  identity_createContactFromPeer: identity.createContactFromPeer,
  identity_createUser: identity.createUser,
  identity_createDeveloper: identity.createDeveloper,
  identity_deleteContact: identity.deleteContact,
  identity_getOwnUsers: identity.getOwnUsers,
  identity_getOwnDevelopers: identity.getOwnDevelopers,
  identity_getPeers: identity.getPeers,
  identity_updateUser: identity.updateUser,
  identity_linkEthWallet: identity.linkEthWallet,
  identity_unlinkEthWallet: identity.unlinkEthWallet,

  sub_unsubscribe: sub.unsubscribe,

  vault_create: vault.create,
  vault_getSettings: vault.getSettings,
  vault_open: vault.open,
  vault_setSettings: vault.setSettings,

  wallet_createHD: wallet.createHDWallet,
  wallet_importMnemonic: wallet.importMnemonic,
  wallet_addHDAccount: wallet.addHDAccount,
  wallet_delete: wallet.deleteWallet,
  wallet_getUserEthWallets: wallet.getUserEthWallets,
  wallet_getUserEthAccounts: wallet.getUserEthAccounts,
  wallet_ledgerGetEthAccounts: wallet.getLedgerEthAccounts,
  wallet_ledgerAddEthAccounts: wallet.addLedgerEthAccounts,
  wallet_setUserDefault: wallet.setUsersDefaultWallet,
  wallet_signTx: wallet.signTransaction,
  wallet_subEthAccountsChanged: wallet.subEthAccountsChanged,
}
