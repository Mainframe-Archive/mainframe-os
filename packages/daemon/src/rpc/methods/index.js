// @flow

import * as app from './app'
import * as blockchain from './blockchain'
import * as graphql from './graphql'
import * as identity from './identity'
import * as pss from './pss'
import * as sub from './subscription'
import * as vault from './vault'
import * as wallet from './wallet'

const noop = () => {}

export default {
  api_version: () => 0.1,

  app_checkPermission: app.checkPermission,
  app_close: app.close,
  app_install: app.install,
  app_remove: app.remove,
  app_open: app.open,
  app_getAll: app.getAll,
  app_setPermission: app.setPermission,
  app_setUserPermissionsSettings: app.setUserPermissionsSettings,
  app_setUserSettings: app.setUserSettings,
  // TODO: remove app for given user only
  // Options:
  // - "clear": removes app contents, only possible if there is no user left for app
  // - "remove": clear + also removes manifest, no more knowledge about this app in vault
  app_uninstall: noop,
  app_update: noop, // TODO: similar to install
  app_create: app.create,
  app_getManifestData: app.getManifestData,
  app_setPermissionsRequirements: app.setPermissionsRequirements,
  app_publishContents: app.publishContents,
  app_writeManifest: app.writeManifest,

  blockchain_web3Send: blockchain.web3Send,

  graphql_query: graphql.query,
  graphql_subscription: graphql.subscription,

  identity_addPeer: identity.addPeer,
  identity_addPeerByFeed: identity.addPeerByFeed,
  identity_createUser: identity.createUser,
  identity_createDeveloper: identity.createDeveloper,
  identity_deleteContact: identity.deleteContact,
  identity_getOwnUsers: identity.getOwnUsers,
  identity_getOwnDevelopers: identity.getOwnDevelopers,
  identity_getPeers: identity.getPeers,
  identity_linkEthWallet: identity.linkEthWallet,
  identity_unlinkEthWallet: identity.unlinkEthWallet,
  identity_getUserContacts: identity.getUserContacts,

  // Temporary PSS APIs - should be removed when communication APIs are settled
  pss_baseAddr: pss.baseAddr,
  pss_createTopicSubscription: pss.createTopicSubscription,
  pss_getPublicKey: pss.getPublicKey,
  pss_sendAsym: pss.sendAsym,
  pss_setPeerPublicKey: pss.setPeerPublicKey,
  pss_stringToTopic: pss.stringToTopic,

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
  wallet_ledgerAddEthAccount: wallet.addLedgerEthAccount,
  wallet_signTx: wallet.signTransaction,
}
