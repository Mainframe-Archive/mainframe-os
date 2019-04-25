// @flow

import leveldown from 'leveldown'
import levelAdapter from 'pouchdb-adapter-leveldb'
import * as RxDB from 'rxdb'

import createAppsCollection from './collections/apps'
import createAppVersionsCollection from './collections/appVersions'
import createContactRequestsCollection from './collections/contactRequests'
import createContactsCollection from './collections/contacts'
import createEthWalletsHDCollection from './collections/ethWalletsHD'
import createEthWalletsLedgerCollection from './collections/ethWalletsLedger'
import createOwnAppsCollection from './collections/ownApps'
import createOwnDevelopersCollection from './collections/ownDevelopers'
import createPeersCollection from './collections/peers'
import createUserAppSettingsCollection from './collections/userAppSettings'
import createUsersCollection from './collections/users'

RxDB.plugin(levelAdapter)

export type DB = {
  apps: Object,
  app_versions: Object,
  contact_requests: Object,
  contacts: Object,
  eth_wallets_hd: Object,
  eth_wallets_ledger: Object,
  own_apps: Object,
  own_developers: Object,
  peers: Object,
  user_app_settings: Object,
  users: Object,
}

export const createDB = async (
  location: string,
  password: string,
): Promise<DB> => {
  const db = await RxDB.create({
    name: location,
    adapter: leveldown,
    password,
    multiInstance: false,
  })

  await Promise.all([
    createAppsCollection(db),
    createAppVersionsCollection(db),
    createContactRequestsCollection(db),
    createContactsCollection(db),
    createEthWalletsHDCollection(db),
    createEthWalletsLedgerCollection(db),
    createOwnAppsCollection(db),
    createOwnDevelopersCollection(db),
    createPeersCollection(db),
    createUserAppSettingsCollection(db),
    createUsersCollection(db),
  ])

  return db
}
