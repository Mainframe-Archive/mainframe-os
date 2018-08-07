// @flow

// import type { ManifestData } from '@mainframe/app-manifest'

import App, { type AppParams } from './App'

export type AppVersionPublicationState =
  | 'unpublished'
  | 'contents_published'
  | 'manifest_published'

export type AppVersion = {
  manifest: Object, // TODO: partial manifest data
  publicationState: AppVersionPublicationState,
}

export type OwnAppParams = AppParams & {
  versions: { [version: string]: AppVersion },
}

export type OwnAppSerialized = OwnAppParams

export default class OwnApp extends App {
  // $FlowFixMe: extending params
  static fromJSON = (params: OwnAppSerialized): OwnApp => new OwnApp(params)

  // $FlowFixMe: extending App
  static toJSON = (app: OwnApp): OwnAppSerialized => ({
    ...App.toJSON(app),
    versions: app._versions,
  })

  _versions: { [version: string]: AppVersion }

  constructor(params: OwnAppParams) {
    const { versions, ...appParams } = params
    super(appParams)
    this._versions = versions
  }
}
