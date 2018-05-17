// @flow

import type App from '../app/App'
import AppsManager, { type AppsManagerSerialized } from '../app/AppsManager'
import IdentitiesManager, {
  type IdentitiesManagerSerialized,
} from '../identity/IdentitiesManager'
import type Keychain from '../identity/Keychain'
import { type ID, readSecureFile, writeSecureFile } from '../utils'

export type VaultData = {
  apps: AppsManager,
  identities: IdentitiesManager,
}

export type VaultSerialized = {
  apps?: AppsManagerSerialized,
  identities?: IdentitiesManagerSerialized,
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
      apps: AppsManager.fromJSON(data.apps),
      identities: IdentitiesManager.fromJSON(data.identities),
    })
  }

  _path: string
  _key: Buffer
  _data: VaultData

  constructor(path: string, key: Buffer, data?: ?VaultData) {
    this._path = path
    this._key = key
    if (data == null) {
      this._data = {
        apps: new AppsManager(),
        identities: new IdentitiesManager(),
      }
    } else {
      this._data = data
    }
  }

  get apps(): AppsManager {
    return this._data.apps
  }

  get identities(): IdentitiesManager {
    return this._data.identities
  }

  checkKey(key: Buffer): boolean {
    return this._key.equals(key)
  }

  save() {
    const contents = Buffer.from(JSON.stringify(this.toJSON()))
    return writeSecureFile(this._path, contents, this._key)
  }

  toJSON(): VaultSerialized {
    return this._data
      ? {
          apps: AppsManager.toJSON(this._data.apps),
          identities: IdentitiesManager.toJSON(this._data.identities),
        }
      : {}
  }
}
