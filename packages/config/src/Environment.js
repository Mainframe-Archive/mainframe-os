// @flow

import Conf from 'conf'
import envPaths from 'env-paths'
import { join } from 'path'

import type { EnvPaths, EnvType } from './types'

export const ENV_TYPE_KEY = 'env_type'

export default class Environment {
  _conf: Conf
  _name: string
  _paths: EnvPaths

  constructor(name: string, type: ?EnvType = 'development') {
    if (name == null) {
      throw new Error('Missing environment name')
    }

    const namespace = `mainframe-${name}`
    this._name = name
    this._conf = new Conf({
      // NOT a security measure - see https://github.com/sindresorhus/conf#encryptionkey
      encryptionKey: 'mainframe',
      projectName: namespace,
    })
    this._paths = envPaths(namespace)

    if (!this._conf.has(ENV_TYPE_KEY)) {
      this._conf.set(ENV_TYPE_KEY, type)
    }
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
    return this._conf.get(ENV_TYPE_KEY)
  }

  set type(value: EnvType) {
    this._conf.set(ENV_TYPE_KEY, value)
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
