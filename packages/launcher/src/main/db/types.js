// @flow

import type { Logger } from '../logger'

export type Collections = {
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
  user_app_versions: Object,
  users: Object,
}

export type Collection = $Keys<Collections>

export type DB = Collections & {
  collection: (params: Object) => Object,
}

export type DBParams = {
  location: string,
  logger: Logger,
  password: string,
}

export type CollectionParams = { db: DB, logger: Logger }
