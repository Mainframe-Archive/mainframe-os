// @flow

import { dirname } from 'path'
import { ensureDir } from 'fs-extra'
import leveldown from 'leveldown'
import levelAdapter from 'pouchdb-adapter-leveldb'
import * as RxDB from 'rxdb'

import createAppsCollection from './collections/apps'
import createAppVersionsCollection from './collections/appVersions'
import createContactRequestsCollection from './collections/contactRequests'
import createContactsCollection from './collections/contacts'
import createDevelopersCollection from './collections/developers'
import createEthWalletsHDCollection from './collections/ethWalletsHD'
import createEthWalletsLedgerCollection from './collections/ethWalletsLedger'
import createOwnAppsCollection from './collections/ownApps'
import createOwnDevelopersCollection from './collections/ownDevelopers'
import createPeersCollection from './collections/peers'
import createUserAppSettingsCollection from './collections/userAppSettings'
import createUserAppVersionsCollection from './collections/userAppVersions'
import createUserOwnAppsCollection from './collections/userOwnApps'
import createUsersCollection from './collections/users'
import type { DB, DBParams } from './types'

RxDB.plugin(levelAdapter)

export const createDB = async (params: DBParams): Promise<DB> => {
  await ensureDir(dirname(params.location))

  // Uncomment the following line to reset the DB in development
  // await RxDB.removeDatabase(params.location, leveldown)

  const db = await RxDB.create({
    name: params.location,
    adapter: leveldown,
    password: params.password,
    multiInstance: false,
  })

  const collectionParams = { db, logger: params.logger }
  await Promise.all([
    createAppsCollection(collectionParams),
    createAppVersionsCollection(collectionParams),
    createContactRequestsCollection(collectionParams),
    createContactsCollection(collectionParams),
    createDevelopersCollection(collectionParams),
    createEthWalletsHDCollection(collectionParams),
    createEthWalletsLedgerCollection(collectionParams),
    createOwnAppsCollection(collectionParams),
    createOwnDevelopersCollection(collectionParams),
    createPeersCollection(collectionParams),
    createUserAppSettingsCollection(collectionParams),
    createUserAppVersionsCollection(collectionParams),
    createUserOwnAppsCollection(collectionParams),
    createUsersCollection(collectionParams),
  ])

  return db
}
