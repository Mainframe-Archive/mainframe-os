// @flow

import type { StrictPermissionsGrants } from './main/db/schemas/appPermissionsGrants'
import type { GenericProfileData } from './main/db/schemas/genericProfile'

// UI

type StyleObject = { [key: string]: string | number }
export type Style =
  | void
  | number
  | StyleObject
  | Array<void | number | StyleObject>

// App

export type AppData = {
  contentsPath: string,
  profile: GenericProfileData,
  publicID: string,
}

export type AppWindowSession = {
  app: {
    contentsURL: string,
    profile: GenericProfileData,
    publicID: string,
  },
  isDevelopment: boolean,
  partition: string,
  permissions: StrictPermissionsGrants,
  user: {
    id: string,
    profile: GenericProfileData,
  },
}

// Request

// export type ClientResponse = {
//   id: string,
//   error?: Object,
//   result?: Object,
// }

// export type RequestContext = {
//   request: Object,
//   appSession: AppSession,
//   window: BrowserWindow,
//   client: Client,
// }

// RPC

export type DBRequestParams = { password: string, save?: ?boolean }

export type DBOpenResult = { user: boolean, wallet: boolean }

export type GraphQLRequestParams = { query: string, variables?: ?Object }

export type UserCreateRequestParams = {
  profile: { name: string },
  isPrivate: boolean,
}
