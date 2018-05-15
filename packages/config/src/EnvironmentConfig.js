// @flow

import type Environment from './Environment'

export default class EnvironmentConfig {
  _env: Environment

  constructor(env: Environment) {
    this._env = env
  }

  createWhenValue(key: string) {
    return this._env.createWhenValue(key)
  }
}
