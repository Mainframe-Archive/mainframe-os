// @flow

import type {
  PermissionKey,
  PermissionCheckResult,
} from '@mainframe/app-permissions'
// eslint-disable-next-line import/named
import { type ID } from '@mainframe/utils-id'

import {
  type default as App,
  type AppManifest,
  type AppUserSettings, // eslint-disable-line import/named
  type SessionData,
} from '../app/App'
import AppsRepository, {
  type AppsRepositorySerialized, // eslint-disable-line import/named
} from '../app/AppsRepository'
import type Session from '../app/Session'
import IdentitiesRepository, {
  type IdentitiesRepositorySerialized, // eslint-disable-line import/named
} from '../identity/IdentitiesRepository'
import type Keychain from '../identity/Keychain'
import { readSecureFile, writeSecureFile } from '../utils'

export type VaultData = {
  apps: AppsRepository,
  identities: IdentitiesRepository,
}

export type VaultSerialized = {
  apps?: AppsRepositorySerialized,
  identities?: IdentitiesRepositorySerialized,
}

export default class Vault {
  static create = async (path: string, key: Buffer): Promise<Vault> => {
    const vault = new Vault(path, key)
    await vault.save()
    return vault
  }

  static open = async (path: string, key: Buffer): Promise<Vault> => {
    const buffer = await readSecureFile(path, key)
    if (buffer == null) {
      throw new Error('Unable to open vault')
    }
    const data = JSON.parse(buffer.toString())
    return new Vault(path, key, {
      apps: AppsRepository.fromJSON(data.apps),
      identities: IdentitiesRepository.fromJSON(data.identities),
    })
  }

  _path: string
  _key: Buffer
  _data: VaultData
  _sessions: { [ID]: Session } = {}

  constructor(path: string, key: Buffer, data?: ?VaultData) {
    this._path = path
    this._key = key
    if (data == null) {
      this._data = {
        apps: new AppsRepository(),
        identities: new IdentitiesRepository(),
      }
    } else {
      this._data = data
    }
  }

  get path(): string {
    return this._path
  }

  get apps(): AppsRepository {
    return this._data.apps
  }

  get identities(): IdentitiesRepository {
    return this._data.identities
  }

  // App

  closeApp(sessID: ID): void {
    delete this._sessions[sessID]
  }

  openApp(appID: ID, userID: ID): SessionData {
    const sessionData = this.apps.createSession(appID, userID)
    this._sessions[sessionData.sessID] = sessionData.session
    return sessionData
  }

  installApp(manifest: AppManifest, userID: ID, settings: AppUserSettings): ID {
    let appID = this.apps.getID(manifest.id)
    if (appID == null) {
      // Add app with user settings
      appID = this.apps.add(manifest, userID, settings)
    } else {
      // Set user settings for already existing app
      this.apps.setUserSettings(appID, userID, settings)
    }
    return appID
  }

  removeApp(appID: ID) {
    this.apps.remove(appID)
  }

  // Session

  getSession(id: ID): ?Session {
    return this._sessions[id]
  }

  // Vault lifecycle

  save() {
    const contents = Buffer.from(JSON.stringify(this.toJSON()))
    return writeSecureFile(this._path, contents, this._key)
  }

  toJSON(): VaultSerialized {
    return this._data
      ? {
          apps: AppsRepository.toJSON(this._data.apps),
          identities: IdentitiesRepository.toJSON(this._data.identities),
        }
      : {}
  }
}
