// @flow

import Conf from 'conf'
import envPaths from 'env-paths'
import { remove } from 'fs-extra'
import { join } from 'path'

import type { EnvPaths, EnvType } from './types'

const DEFAULT_KEY = 'default'
const ENVS_KEY = 'envs'

const createConf = (projectName: string) => {
  return new Conf({
    // NOT a security measure - see https://github.com/sindresorhus/conf#encryptionkey
    encryptionKey: 'mainframe',
    projectName,
  })
}

// Global config used to store the list of envs
// Do not use for anything else than envs metadata, actual configs should be env-specific
const envsConf = createConf('mainframe-envs')
const envKey = (name: string): string => `${ENVS_KEY}.${name}`

export default class Environment {
  static create(
    name: string,
    type?: EnvType = 'development',
    setDefault: boolean = false,
  ): Environment {
    if (name == null) {
      throw new Error('Missing environment name')
    }

    const key = envKey(name)
    if (envsConf.has(key)) {
      throw new Error('Environment already exists')
    }

    envsConf.set(key, type)
    if (setDefault) {
      envsConf.set(DEFAULT_KEY, name)
    }

    return new Environment(name)
  }

  static exists(name: string): boolean {
    return envsConf.has(envKey(name))
  }

  static get(name: string, type?: EnvType): Environment {
    return Environment.exists(name)
      ? Environment.load(name)
      : Environment.create(name, type)
  }

  static list(): { [name: string]: EnvType } {
    return envsConf.get(ENVS_KEY) || {}
  }

  static load(name: string): Environment {
    if (name == null) {
      throw new Error('Missing environment name')
    }
    if (envsConf.has(envKey(name))) {
      return new Environment(name)
    }
    throw new Error('Unknown environment')
  }

  static async destroy(name: string) {
    const env = Environment.load(name)
    // Delete all environment folders
    await Promise.all(Object.values(env.paths).map(remove))

    envsConf.delete(envKey(name))
    if (envsConf.get(DEFAULT_KEY) === name) {
      envsConf.delete(DEFAULT_KEY)
    }
  }

  static getDefault(): ?string {
    return envsConf.get(DEFAULT_KEY)
  }

  static setDefault(name: string) {
    if (Environment.exists(name)) {
      envsConf.set(DEFAULT_KEY, name)
    } else {
      throw new Error('Unknown environment')
    }
  }

  _conf: Conf
  _name: string
  _paths: EnvPaths

  constructor(name: string) {
    const namespace = `mainframe-env-${name}`
    this._name = name
    this._conf = createConf(namespace)
    this._paths = envPaths(namespace)
  }

  get config(): Conf {
    return this._conf
  }

  get name(): string {
    return this._name
  }

  get paths(): EnvPaths {
    return this._paths
  }

  get type(): EnvType {
    return envsConf.get(envKey(this.name))
  }

  set type(value: EnvType) {
    envsConf.set(envKey(this.name), value)
  }

  get isDev(): boolean {
    return this.type === 'development'
  }

  get isProd(): boolean {
    return this.type === 'production'
  }

  get isTesting(): boolean {
    return this.type === 'testing'
  }

  createBinPath(path: string): string {
    return join(this._paths.config, 'bin', path)
  }

  createSocketPath(path: string): string {
    return process.platform === 'win32'
      ? join('\\\\?\\pipe', this._paths.config, path)
      : join(this._paths.config, path)
  }

  createWhenValue<T>(key: string, timeout?: number) {
    return (expectedValue: T): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (this._conf.get(key) === expectedValue) {
          resolve()
        } else {
          let resolved = false
          let timeoutID

          const dispose = this._conf.onDidChange(
            key,
            (newValue: T, previousValue: any) => {
              if (newValue === expectedValue && !resolved) {
                resolved = true
                clearTimeout(timeoutID)
                dispose()
                resolve(previousValue)
              }
            },
          )

          if (timeout != null) {
            timeoutID = setTimeout(() => {
              if (!resolved) {
                resolved = true
                dispose()
                reject(new Error('Timeout'))
              }
            }, timeout)
          }
        }
      })
    }
  }
}
