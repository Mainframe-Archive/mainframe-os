// @flow

import type { ManifestData } from '@mainframe/app-manifest'
import { readEncryptedFile, writeEncryptedFile } from '@mainframe/secure-file'
import {
  decodeBase64,
  encodeBase64,
  base64Type,
  type base64, // eslint-disable-line import/named
} from '@mainframe/utils-base64'
import {
  PASSWORDHASH_ALG_ARGON2ID13,
  PASSWORDHASH_MEMLIMIT_SENSITIVE,
  PASSWORDHASH_OPSLIMIT_SENSITIVE,
  createPasswordHashSalt,
  createSecretBoxKeyFromPassword,
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
import type Session from '../app/Session'
import IdentitiesRepository, {
  type IdentitiesRepositorySerialized, // eslint-disable-line import/named
} from '../identity/IdentitiesRepository'

type VaultKDF = {
  algorithm: number,
  memlimit: number,
  opslimit: number,
  salt: base64,
}

type VaultMetadata = {
  version: 1,
  kdf: VaultKDF,
}

type VaultKeyParams = {
  key: Buffer,
  kdf: VaultKDF,
}

export const createVaultKeyParams = async (
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

export const readVaultFile = async (
  path: string,
  password: Buffer,
): Promise<{ keyParams: VaultKeyParams, data: Object }> => {
  let keyParams
  const file = await readEncryptedFile(path, async (meta: ?VaultMetadata) => {
    if (meta == null) {
      throw new Error('Missing metadata')
    }
    if (meta.version !== 1) {
      throw new Error('Invalid vault format version')
    }
    if (meta.kdf == null) {
      throw new Error('Missing KDF parameters in metadata')
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
  if (keyParams == null) {
    throw new Error('Invalid file')
  }

  return {
    data: JSON.parse(file.opened.toString()),
    keyParams,
  }
}

export type UserSettings = {
  bzzURL: string,
  web3HTTPProvider: string,
}

export type VaultData = {
  apps: AppsRepository,
  identities: IdentitiesRepository,
  settings: UserSettings,
}

export type VaultSerialized = {
  apps?: AppsRepositorySerialized,
  identities?: IdentitiesRepositorySerialized,
  settings?: UserSettings,
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
      settings: data.settings,
    })
  }

  _path: string
  _keyParams: VaultKeyParams
  _data: VaultData
  _sessions: { [ID]: Session } = {}

  constructor(path: string, keyParams: VaultKeyParams, data?: ?VaultData) {
    this._path = path
    this._keyParams = keyParams

    const vaultData = {
      apps: new AppsRepository(),
      identities: new IdentitiesRepository(),
      settings: {
        bzzURL: 'http://swarm-gateways.net',
        web3HTTPProvider: 'https://mainnet.infura.io/KWLG1YOMaYgl4wiFlcJv',
      },
    }
    this._data = data ? Object.assign(vaultData, data) : vaultData
  }

  // Getters

  get path(): string {
    return this._path
  }

  get apps(): AppsRepository {
    return this._data.apps
  }

  get identities(): IdentitiesRepository {
    return this._data.identities
  }

  get settings(): UserSettings {
    return this._data.settings
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
    manifest: ManifestData,
    userID: ID,
    settings: AppUserSettings,
  ): App {
    let app = this.apps.getByBase64(base64Type(manifest.id))
    if (app == null) {
      // Add app with user settings
      app = this.apps.add(manifest, userID, settings)
    } else {
      // Set user settings for already existing app
      this.apps.setUserSettings(app.id, userID, settings)
    }
    return app
  }

  removeApp(appID: ID) {
    this.apps.remove(appID)
  }

  // Session

  getSession(id: ID): ?Session {
    return this._sessions[id]
  }

  // Settings

  setBzzURL(url: string): void {
    this._data.settings.bzzURL = url
  }

  setWeb3HTTPProvider(provider: string): void {
    this._data.settings.web3HTTPProvider = provider
  }

  // Vault lifecycle

  save() {
    const data = Buffer.from(JSON.stringify(this.toJSON()))
    return writeEncryptedFile(this._path, data, this._keyParams.key, {
      version: 1,
      kdf: this._keyParams.kdf,
    })
  }

  toJSON(): VaultSerialized {
    return this._data
      ? {
          apps: AppsRepository.toJSON(this._data.apps),
          identities: IdentitiesRepository.toJSON(this._data.identities),
          settings: this._data.settings,
        }
      : {}
  }
}
