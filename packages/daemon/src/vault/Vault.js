// @flow

import { type ManifestData } from '@mainframe/app-manifest'
import { type PermissionsRequirements } from '@mainframe/app-permissions'
import type { AppUserPermissionsSettings } from '@mainframe/client'
import { readEncryptedFile, writeEncryptedFile } from '@mainframe/secure-file'
import {
  decodeBase64,
  encodeBase64,
  type base64,
} from '@mainframe/utils-base64'
import {
  PASSWORDHASH_ALG_ARGON2ID13,
  PASSWORDHASH_MEMLIMIT_SENSITIVE,
  PASSWORDHASH_OPSLIMIT_SENSITIVE,
  createPasswordHashSalt,
  createSecretBoxKeyFromPassword,
} from '@mainframe/utils-crypto'
import { type ID } from '@mainframe/utils-id'

import type { SessionData } from '../app/AbstractApp'
import type App from '../app/App'
import AppsRepository, {
  type AppsRepositorySerialized,
} from '../app/AppsRepository'
import type Session from '../app/Session'
import IdentitiesRepository, {
  type IdentitiesRepositorySerialized,
} from '../identity/IdentitiesRepository'
import WalletsRepository, {
  type WalletsRepositorySerialized,
} from '../wallet/WalletsRepository'
import IdentityWallets, {
  type IdentityWalletsSerialized,
} from '../identity/IdentityWallets'

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
  pssURL: string,
  ethURL: string,
  ethChainID: number,
}

export type VaultData = {
  apps: AppsRepository,
  identities: IdentitiesRepository,
  settings: UserSettings,
  wallets: WalletsRepository,
  identityWallets: IdentityWallets,
}

export type VaultSerialized = {
  apps?: AppsRepositorySerialized,
  identities?: IdentitiesRepositorySerialized,
  settings?: UserSettings,
  wallets?: WalletsRepositorySerialized,
  identityWallets?: IdentityWalletsSerialized,
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
      wallets: WalletsRepository.fromJSON(data.wallets),
      identityWallets: IdentityWallets.fromJSON(data.identityWallets),
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
        pssURL: 'ws://localhost:8546',
        ethURL: 'https://ropsten.infura.io/KWLG1YOMaYgl4wiFlcJv',
        ethChainID: 3, // Mainnet 1, Ropsten 3, Rinkeby 4, Kovan 42, Local (ganache) 1977
      },
      identityWallets: new IdentityWallets(),
      wallets: new WalletsRepository(),
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

  get wallets(): WalletsRepository {
    return this._data.wallets
  }

  get identityWallets(): IdentityWallets {
    return this._data.identityWallets
  }

  // App lifecycle

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
    settings: AppUserPermissionsSettings,
  ): App {
    let app = this.apps.getByMFID(manifest.id)
    if (app == null) {
      // Add app with user settings
      app = this.apps.add(manifest, userID, settings)
    } else {
      // Set user settings for already existing app
      this.apps.setUserPermissionsSettings(app.id, userID, settings)
    }
    return app
  }

  removeApp(appID: ID) {
    this.apps.remove(appID)
  }

  getSession(id: ID): ?Session {
    return this._sessions[id]
  }

  // App creation and management

  setAppPermissionsRequirements(
    appID: ID,
    permissions: PermissionsRequirements,
    version?: ?string,
  ): void {
    const app = this.apps.getOwnByID(appID)
    if (app == null) {
      throw new Error('App not found')
    }
    app.setPermissionsRequirements(permissions, version)
  }

  setAppUserPermissionsSettings(
    appID: ID,
    userID: ID,
    settings: AppUserPermissionsSettings,
  ): void {
    this.apps.setUserPermissionsSettings(appID, userID, settings)
  }

  // Settings

  setSettings(settings: $Shape<UserSettings>): UserSettings {
    Object.assign(this._data.settings, settings)
    return this._data.settings
  }

  setBzzURL(url: string): void {
    this._data.settings.bzzURL = url
  }

  setPssURL(url: string): void {
    this._data.settings.pssURL = url
  }

  setEthUrl(url: string): void {
    this._data.settings.ethURL = url
  }

  setEthChainID(chainID: number): void {
    this._data.settings.ethChainID = chainID
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
          wallets: WalletsRepository.toJSON(this._data.wallets),
          identityWallets: IdentityWallets.toJSON(this._data.identityWallets),
          settings: this._data.settings,
        }
      : {}
  }
}
