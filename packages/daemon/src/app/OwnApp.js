// @flow

import {
  createWebRequestGrant,
  mergeGrantsToDetails,
  createRequirements,
  type PermissionsRequirements,
  type StrictPermissionsRequirements,
} from '@mainframe/app-permissions'
import { uniqueID, type ID } from '@mainframe/utils-id'

import { OwnFeed, type OwnFeedSerialized } from '../swarm/feed'

import AbstractApp, {
  type AbstractAppParams,
  type SessionData,
} from './AbstractApp'
import Session from './Session'

export type OwnAppData = {
  contentsPath: string,
  developerID: ID,
  mfid: string,
  name: string,
  version: string,
}

export type AppVersion = {
  permissions: StrictPermissionsRequirements,
  contentsHash?: ?string,
  versionHash?: string,
}

export type OwnAppParams = AbstractAppParams & {
  data: OwnAppData,
  updateFeed: OwnFeed,
  versions: { [version: string]: AppVersion },
}

export type OwnAppSerialized = AbstractAppParams & {
  data: OwnAppData,
  updateFeed: OwnFeedSerialized,
  versions: { [version: string]: AppVersion },
}

export type OwnAppCreationParams = {
  contentsPath: string,
  developerID: ID,
  mfid: string,
  name: string,
  version: string,
  permissions?: ?StrictPermissionsRequirements,
}

export default class OwnApp extends AbstractApp {
  static create = (params: OwnAppCreationParams): OwnApp => {
    return new OwnApp({
      appID: uniqueID(),
      data: {
        contentsPath: params.contentsPath,
        developerID: params.developerID,
        mfid: params.mfid,
        name: params.name || 'Untitled',
        version: params.version,
      },
      updateFeed: OwnFeed.create(),
      versions: {
        [params.version]: {
          permissions: params.permissions || createRequirements(),
        },
      },
    })
  }

  // $FlowFixMe: extending params
  static fromJSON = (params: OwnAppSerialized): OwnApp => {
    const { updateFeed, ...others } = params
    return new OwnApp({ ...others, updateFeed: OwnFeed.fromJSON(updateFeed) })
  }

  // $FlowFixMe: extending App
  static toJSON = (app: OwnApp): OwnAppSerialized => ({
    appID: app._appID,
    data: app._data,
    settings: app._settings,
    updateFeed: OwnFeed.toJSON(app.updateFeed),
    versions: app._versions,
  })

  _data: OwnAppData
  _updateFeed: OwnFeed
  _versions: { [version: string]: AppVersion }

  constructor(params: OwnAppParams) {
    super(params)
    this._data = params.data
    this._updateFeed = params.updateFeed
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

  get updateFeed(): OwnFeed {
    return this._updateFeed
  }

  get versions(): { [version: string]: AppVersion } {
    return this._versions
  }

  getVersionData(version?: ?string): ?AppVersion {
    return this._versions[version || this._data.version]
  }

  // Setters

  createNextVersion(
    version: string,
    permissions?: ?StrictPermissionsRequirements,
  ): void {
    if (this._versions[version] != null) {
      throw new Error('Version already exists')
    }
    const latestVersion = this._versions[this._data.version]
    this._versions[version] = {
      permissions: permissions || latestVersion.permissions,
    }
    this._data.version = version
  }

  setContentsHash(hash: string, version?: ?string): void {
    const v = version || this._data.version
    const versionData = this._versions[v]
    if (versionData == null) {
      throw new Error('Invalid version')
    }
    if (versionData.versionHash != null) {
      throw new Error('Manifest has already been published')
    }
    versionData.contentsHash = hash
    this._versions[v] = versionData
  }

  setVersionHash(hash: string, version?: ?string): void {
    const v = version || this._data.version
    const versionData = this._versions[v]
    if (versionData == null) {
      throw new Error('Invalid version')
    }
    if (versionData.contentsHash == null) {
      throw new Error('Contents have not yet been published')
    }
    versionData.versionHash = hash
    this._versions[v] = versionData
  }

  setPermissionsRequirements(
    permissions: PermissionsRequirements,
    version?: ?string,
  ): void {
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
    }
  }
}
