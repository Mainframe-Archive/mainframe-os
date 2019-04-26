// @flow

import {
  createWebRequestGrant,
  mergeGrantsToDetails,
  createRequirements,
  type PermissionsRequirements,
  type StrictPermissionsRequirements,
} from '@mainframe/app-permissions'
import { uniqueID, type ID } from '@mainframe/utils-id'
import semver from 'semver'

import { OwnFeed, type OwnFeedSerialized, type bzzHash } from '../swarm/feed'

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

export type ListedAppVersion = AppVersion & { version: string }

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

  get name(): string {
    return this._data.name
  }

  get contentsPath(): string {
    return this._data.contentsPath
  }

  get currentVersion(): string {
    return this._data.version
  }

  get mfid(): string {
    return this._data.mfid
  }

  get updateFeed(): OwnFeed {
    return this._updateFeed
  }

  get updateFeedHash(): ?bzzHash {
    return this._updateFeed.feedHash
  }

  get versions(): { [version: string]: AppVersion } {
    return this._versions
  }

  getVersionData(version?: ?string): ?AppVersion {
    return this._versions[version || this.currentVersion]
  }

  getSortedVersions(): Array<ListedAppVersion> {
    return Object.keys(this._versions)
      .sort(semver.rcompare)
      .map(version => ({ ...this._versions[version], version }))
  }

  // Setters

  set name(name: string) {
    this._data.name = name
  }

  set contentsPath(path: string) {
    this._data.contentsPath = path
  }

  editNextVersionNumber(version: string) {
    if (version === this.currentVersion) {
      return
    }
    if (this._versions[version]) {
      throw new Error('Version already exists')
    }
    this._versions[version] = {
      ...this._versions[this.currentVersion],
      version,
    }
    delete this._versions[this.currentVersion]
    this._data.version = version
  }

  createNextVersion(
    version: string,
    permissions?: ?StrictPermissionsRequirements,
  ): void {
    if (this._versions[version] != null) {
      throw new Error('Version already exists')
    }
    if (semver.lte(version, this.currentVersion)) {
      throw new Error('New version must be greater than current one')
    }
    const latestVersion = this._versions[this.currentVersion]
    this._versions[version] = {
      permissions: permissions || latestVersion.permissions,
    }
    this._data.version = version
  }

  setContentsHash(hash: string, version?: ?string): void {
    const v = version || this.currentVersion
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
    const v = version || this.currentVersion
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
    const v = version || this.currentVersion
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
    const versionData = this.getVersionData()
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
      storage: this.getSettings(userID).storageSettings,
    }
  }
}
