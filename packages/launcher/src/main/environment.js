// @flow

import { join } from 'path'
import envPaths from 'env-paths'
import { remove } from 'fs-extra'

import { createConfig, type Config } from './config'

export type EnvPaths = {
  cache: string,
  config: string,
  data: string,
  log: string,
  temp: string,
}

export type EnvType =
  | 'development' // local dev
  | 'testing' // CI or public testing
  | 'production' // don't mess up

export class Environment {
  static get(name: string, type?: EnvType = 'development'): Environment {
    if (name == null) {
      throw new Error('Missing environment name')
    }
    return new Environment(name, type)
  }

  static async destroy(name: string, type?: EnvType) {
    const env = Environment.get(name, type)
    // Delete all environment folders
    // $FlowFixMe: Object.values() losing type
    await Promise.all(Object.values(env.paths).map(path => remove(path)))
  }

  config: Config
  name: string
  paths: EnvPaths
  type: EnvType

  constructor(name: string, type: EnvType) {
    const namespace = `mfos-env-${name}-${type}`
    this.name = name
    this.config = createConfig(namespace, type)
    this.paths = envPaths(namespace)
    this.type = type
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

  getAppContentsPath(appID: string, version: string): string {
    return join(this.paths.data, 'apps', appID, version)
  }

  getDBPath(): string {
    return join(this.paths.data, 'db', 'mfos')
  }

  getLogFilePath(name: string): string {
    return join(this.paths.log, name)
  }
}
