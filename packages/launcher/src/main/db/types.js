// @flow

import type { Logger } from '../logger'

import type { AppsCollection } from './collections/apps'
import type { AppVersionsCollection } from './collections/appVersions'
import type { ContactRequestsCollection } from './collections/contactRequests'
import type { ContactsCollection } from './collections/contacts'
import type { DevelopersCollection } from './collections/developers'
import type { EthWalletsHDCollection } from './collections/ethWalletsHD'
import type { EthWalletsLedgerCollection } from './collections/ethWalletsLedger'
import type { OwnAppsCollection } from './collections/ownApps'
import type { OwnDevelopersCollection } from './collections/ownDevelopers'
import type { PeersCollection } from './collections/peers'
import type { UserAppSettingsCollection } from './collections/userAppSettings'
import type { UserAppVersionsCollection } from './collections/userAppVersions'
import type { UsersCollection } from './collections/users'

export type Populate<T> = {
  populate: <K: $Keys<T>>(field: K) => Promise<$ElementType<T, K>>,
}

export type Collection<DataType, DocType = DataType> = {
  _docType: DocType,
  insert: (data: DataType) => Promise<DocType>,
  find: Function,
  findOne: Function,
  newDocument: (data: DataType) => DocType,
}

export type Collections = {|
  apps: AppsCollection,
  app_versions: AppVersionsCollection,
  contact_requests: ContactRequestsCollection,
  contacts: ContactsCollection,
  developers: DevelopersCollection,
  eth_wallets_hd: EthWalletsHDCollection,
  eth_wallets_ledger: EthWalletsLedgerCollection,
  own_apps: OwnAppsCollection,
  own_developers: OwnDevelopersCollection,
  peers: PeersCollection,
  user_app_settings: UserAppSettingsCollection,
  user_app_versions: UserAppVersionsCollection,
  users: UsersCollection,
|}

export type CollectionKey = $Keys<Collections>

export type CollectionSpec<Methods = {}, Statics = {}> = {
  name: string,
  schema: Object,
  statics: Statics,
  methods: Methods,
}

export type CollectionFactory = <DataType, DocType, Methods, Statics>(
  params: CollectionSpec<Methods, Statics>,
) => Promise<Collection<DataType, DocType> & Statics>

export type DB = {
  ...Collections,
  collection: CollectionFactory,
}

export type CollectionParams = { db: DB, logger: Logger }

export type DBParams = {
  location: string,
  logger: Logger,
  password: string,
}
