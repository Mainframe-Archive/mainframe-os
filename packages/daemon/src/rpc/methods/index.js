// @flow

import * as app from './app'
import * as identity from './identity'
import * as vault from './vault'
import * as web3 from './web3'

export default {
  api_version: () => 0.1,
  app_checkPermission: app.checkPermission,
  app_close: app.close,
  app_install: app.install,
  app_remove: app.remove,
  app_open: app.open,
  app_getInstalled: app.getInstalled,
  app_setPermission: app.setPermission,
  identity_createUser: identity.createUser,
  identity_getOwnUsers: identity.getOwnUsers,
  vault_create: vault.create,
  vault_open: vault.open,
  web3_request: web3.request,
}
