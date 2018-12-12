// @flow

import {
  createWebRequestGrant,
  mergeGrantsToDetails,
  createRequirements,
  type PermissionsRequirements,
  type StrictPermissionsRequirements,
} from '@mainframe/app-permissions'
import { uniqueID, type ID } from '@mainframe/utils-id'

import AbstractApp, {
  type AbstractAppParams,
  type SessionData,
} from './AbstractApp'
import Session from './Session'

export type AppVersionPublicationState =
  | 'unpublished'
  | 'contents_published'
  | 'manifest_published'

export type OwnAppData = {
  contentsPath: string,
  developerID: ID,
  mfid: string,
  name: string,
  version: string,
}

export type AppVersion = {
  contentsURI?: ?string,
  permissions: StrictPermissionsRequirements,
  publicationState: AppVersionPublicationState,
}

export type OwnAppParams = AbstractAppParams & {
  data: OwnAppData,
  versions: { [version: string]: AppVersion },
}

export type OwnAppSerialized = OwnAppParams

export default class OwnApp extends AbstractApp {
  // $FlowFixMe: extending params
  static fromJSON = (params: OwnAppSerialized): OwnApp => new OwnApp(params)

  // $FlowFixMe: extending App
  static toJSON = (app: OwnApp): OwnAppSerialized => ({
    appID: app._appID,
    data: app._data,
    settings: app._settings,
    versions: app._versions,
  })

  _data: OwnAppData
  _versions: { [version: string]: AppVersion }

  constructor(params: OwnAppParams) {
    super(params)
    this._data = params.data
    this._versions = params.versions
  }

  // Getters

  get data(): OwnAppData {
    return this._data
  }

  get contentsPath(): string {
    return this._data.contentsPath
  }

  get mfid(): string {
    return this._data.mfid
  }

  get versions(): { [version: string]: AppVersion } {
    return this._versions
  }

  getVersionData(version?: ?string): ?AppVersion {
    return this._versions[version || this._data.version]
  }

  // Setters

  setContentsURI(contentsURI: string, version?: ?string) {
    const v = version || this._data.version
    const versionData = this._versions[v]
    if (versionData == null) {
      throw new Error('Invalid version')
    }
    if (versionData.publicationState === 'manifest_published') {
      throw new Error('Manifest has already been published')
    }
    versionData.contentsURI = contentsURI
    versionData.publicationState = 'contents_published'
    this._versions[v] = versionData
  }

  setPermissionsRequirements(
    permissions: PermissionsRequirements,
    version?: ?string,
  ) {
    const v = version || this._data.version
    const versionData = this._versions[v]
    if (versionData == null) {
      throw new Error('Invalid version')
    }
    const requirements = createRequirements(
      permissions.required,
      permissions.optional,
    )
    versionData.permissions = requirements
    this._versions[v] = versionData
  }

  // Session

  createSession(userID: ID): SessionData {
    const versionData = this._versions[this._data.version]
    if (versionData == null) {
      throw new Error('Invalid version')
    }
    // TODO: Make permissions experience similar to installed
    //       apps to allow developers to fully test flows
    const appPermissions = {
      ...versionData.permissions.required,
      WEB_REQUEST: createWebRequestGrant(
        versionData.permissions.required.WEB_REQUEST,
      ),
    }
    const userPermissions = this.getPermissions(userID) || {
      WEB_REQUEST: createWebRequestGrant(),
    }
    const permissions = mergeGrantsToDetails(appPermissions, userPermissions)
    const session = new Session(this._appID, userID, permissions.session)
    return {
      sessID: uniqueID(),
      isDev: true,
      session,
      permissions,
      storage: this.storage,
    }
  }
}
