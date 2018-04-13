// @flow

import AppsManager, { type AppsManagerSerialized } from '../app/AppsManager'
import IdentitiesManager, {
  type IdentitiesManagerSerialized,
} from '../identity/IdentitiesManager'
import type OwnIdentity from '../identity/OwnIdentity'
import { uniqueID, type ID, readSecureFile, writeSecureFile } from '../utils'

export type VaultSerialized = {
  apps: AppsManagerSerialized,
  identities: IdentitiesManagerSerialized,
}

export default class Vault {
  static create = async (path: string, key: Buffer): Promise<Vault> => {
    const vault = new Vault(path, key)
    await vault.save()
    vault._setOpened()
    return vault
  }

  _path: string
  _key: Buffer
  _apps: ?AppsManager
  _identities: ?IdentitiesManager
  _isOpen: boolean = false
  _opened: Promise<void>
  _setOpened: () => void

  constructor(path: string, key: Buffer) {
    this._path = path
    this._key = key
    this._opened = new Promise(resolve => {
      this._setOpened = () => {
        this._isOpen = true
        resolve()
      }
    })
  }

  get isOpen(): boolean {
    return this._isOpen
  }

  get opened(): Promise<void> {
    return this._opened
  }

  checkKey(key: Buffer): boolean {
    return this._key.equals(key)
  }

  async open() {
    const buffer = await readSecureFile(this._path, this._key)
    if (buffer == null) {
      throw new Error('Unable to open vault')
    }

    const data = JSON.parse(buffer.toString())
    this._apps = AppsManager.hydrate(data.apps)
    this._identities = IdentitiesManager.hydrate(data.identities)

    this._setOpened()
  }

  save() {
    const contents = Buffer.from(JSON.stringify(this.serialized()))
    return writeSecureFile(this._path, contents, this._key)
  }

  serialized(): VaultSerialized {
    return {
      apps: this._apps ? this._apps.serialized() : [],
      identities: this._identities ? this._identities.serialized() : [],
    }
  }

  createIdentity(seed?: Buffer): OwnIdentity {
    if (this._identities == null) {
      throw new Error('Vault is not open')
    }
    return this._identities.create(seed)
  }
}
