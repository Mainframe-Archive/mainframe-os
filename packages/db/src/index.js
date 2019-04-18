// @flow

import leveldown from 'leveldown'
import levelAdapter from 'pouchdb-adapter-leveldb'
import * as RxDB from 'rxdb'

import createAppsCollection from './collections/apps'
import createAppVersionsCollection from './collections/appVersions'
import createContactRequestsCollection from './collections/contactRequests'
import createContactsCollection from './collections/contacts'
import createOwnAppsCollection from './collections/ownApps'
import createOwnDevelopersCollection from './collections/ownDevelopers'
import createPeersCollection from './collections/peers'
import createUserAppSettingsCollection from './collections/userAppSettings'
import createUsersCollection from './collections/users'

RxDB.plugin(levelAdapter)

export default async (location: string, password: string) => {
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
    createOwnAppsCollection(db),
    createOwnDevelopersCollection(db),
    createPeersCollection(db),
    createUserAppSettingsCollection(db),
    createUsersCollection(db),
  ])

  return db
}
