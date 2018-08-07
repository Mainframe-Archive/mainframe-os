// @flow

import * as app from './app'
import * as identity from './identity'
import * as sub from './subscription'
import * as vault from './vault'
import * as web3 from './web3'

const noop = () => {}

export default {
  api_version: () => 0.1,
  app_checkPermission: app.checkPermission,
  app_close: app.close,
  app_install: app.install,
  // TODO: list apps with filter by optional status such as having a manifest, installing or getInstalled
  // Without filter, return all apps
  app_list: noop,
  app_remove: app.remove,
  app_open: app.open,
  app_getInstalled: app.getInstalled, // TODO: remove, replaced by list
  app_setPermission: app.setPermission,
  // TODO: remove app for given user only
  // Options:
  // - "clear": removes app contents, only possible if there is no user left for app
  // - "remove": clear + also removes manifest, no more knowledge about this app in vault
  app_uninstall: noop,
  app_update: noop, // TODO: similar to install
  app_create: app.create,
  app_publishContents: app.publishContents,
  app_writeManifest: app.writeManifest,
  identity_createUser: identity.createUser,
  identity_createDeveloper: identity.createDeveloper,
  identity_getOwnUsers: identity.getOwnUsers,
  identity_getOwnDevelopers: identity.getOwnDevelopers,
  sub_unsubscribe: sub.unsubscribe,
  vault_create: vault.create,
  vault_open: vault.open,
  web3_request: web3.request,
}
