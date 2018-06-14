// @flow

import type {
  PermissionKey,
  PermissionCheckResult,
} from '@mainframe/app-permissions'
import { readEncryptedFile, writeEncryptedFile } from '@mainframe/secure-file'
import {
  decodeBase64,
  encodeBase64,
  type base64, // eslint-disable-line import/named
} from '@mainframe/utils-base64'
import {
  PASSWORDHASH_ALG_ARGON2ID13,
  PASSWORDHASH_MEMLIMIT_SENSITIVE,
  PASSWORDHASH_OPSLIMIT_SENSITIVE,
  createSecretBoxKeyFromPassword,
  createPasswordHashSalt,
} from '@mainframe/utils-crypto'
// eslint-disable-next-line import/named
import { type ID } from '@mainframe/utils-id'

import {
  type default as App,
  type AppUserSettings, // eslint-disable-line import/named
  type SessionData,
} from '../app/App'
import AppsRepository, {
  type AppsRepositorySerialized, // eslint-disable-line import/named
} from '../app/AppsRepository'
import { type AppManifest } from '../app/manifest'
import type Session from '../app/Session'
import IdentitiesRepository, {
  type IdentitiesRepositorySerialized, // eslint-disable-line import/named
} from '../identity/IdentitiesRepository'
import type Keychain from '../identity/Keychain'
import { readSecureFile, writeSecureFile } from '../utils'

type VaultKDF = {
  algorithm: number,
  memlimit: number,
  opslimit: number,
  salt: base64,
}

type VaultMetadata = {
  kdf: VaultKDF,
}

type VaultKeyParams = {
  key: Buffer,
  kdf: VaultKDF,
}

const createVaultKeyParams = async (
  password: Buffer,
): Promise<VaultKeyParams> => {
  const salt = createPasswordHashSalt()
  const kdf = {
    algorithm: PASSWORDHASH_ALG_ARGON2ID13,
    memlimit: PASSWORDHASH_MEMLIMIT_SENSITIVE,
    opslimit: PASSWORDHASH_OPSLIMIT_SENSITIVE,
    salt: encodeBase64(salt),
  }
  const key = await createSecretBoxKeyFromPassword(
    password,
    salt,
    kdf.opslimit,
    kdf.memlimit,
    kdf.algorithm,
  )
  return { kdf, key }
}

const readVaultFile = async (
  path: string,
  password: Buffer,
): Promise<{ keyParams: VaultKeyParams, data: Object }> => {
  let keyParams
  const file = await readEncryptedFile(path, async (meta: ?VaultMetadata) => {
    if (meta == null) {
      throw new Error('Missing metadata')
    }

    const key = await createSecretBoxKeyFromPassword(
      password,
      decodeBase64(meta.kdf.salt),
      meta.kdf.opslimit,
      meta.kdf.memlimit,
      meta.kdf.algorithm,
    )
    keyParams = { key, kdf: meta.kdf }

    return key
  })

  if (file.opened == null) {
    throw new Error('Invalid password')
  }
  return JSON.parse(file.opened.toString())
}

export type VaultData = {
  apps: AppsRepository,
  identities: IdentitiesRepository,
}

export type VaultSerialized = {
  apps?: AppsRepositorySerialized,
  identities?: IdentitiesRepositorySerialized,
}

export default class Vault {
  static create = async (path: string, password: Buffer): Promise<Vault> => {
    const keyParams = await createVaultKeyParams(password)
    const vault = new Vault(path, keyParams)
    await vault.save()
    return vault
  }

  static open = async (path: string, password: Buffer): Promise<Vault> => {
    const { data, keyParams } = await readVaultFile(path, password)
    return new Vault(path, keyParams, {
      apps: AppsRepository.fromJSON(data.apps),
      identities: IdentitiesRepository.fromJSON(data.identities),
    })
  }

  _path: string
  _keyParams: VaultKeyParams
  _data: VaultData
  _sessions: { [ID]: Session } = {}

  constructor(path: string, keyParams: VaultKeyParams, data?: ?VaultData) {
    this._path = path
    this._keyParams = keyParams
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

  installApp(
    manifest: AppManifest,
    userID: ID,
    settings: AppUserSettings,
  ): SessionData {
    let appID = this.apps.getID(manifest.id)
    if (appID == null) {
      // Add app with user settings
      appID = this.apps.add(manifest, userID, settings)
    } else {
      // Set user settings for already existing app
      this.apps.setUserSettings(appID, userID, settings)
    }
    return this.openApp(appID, userID)
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
    const data = Buffer.from(JSON.stringify(this.toJSON()))
    return writeEncryptedFile(this._path, data, this._keyParams.key, {
      kdf: this._keyParams.kdf,
    })
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
