// @flow

import type Environment from './Environment'
import EnvironmentConfig from './EnvironmentConfig'
import type { RunStatus } from './types'

export const SWARM_BIN_PATH_KEY = 'swarm.bin_path'
export const SWARM_SOCKET_PATH_KEY = 'swarm.socket_path'
export const SWARM_RUN_STATUS_KEY = 'swarm.run_status'

export const getBinPath = (env: Environment): ?string => {
  return env.config.get(SWARM_BIN_PATH_KEY)
}

export const setBinPath = (env: Environment, path: string): void => {
  env.config.set(SWARM_BIN_PATH_KEY, path)
}

export const getSocketPath = (env: Environment): string => {
  return env.config.get(SWARM_SOCKET_PATH_KEY)
}

export const setSocketPath = (env: Environment, path: string): void => {
  env.config.set(SWARM_SOCKET_PATH_KEY, path)
}

export const getRunStatus = (env: Environment): RunStatus => {
  return env.config.get(SWARM_RUN_STATUS_KEY) || 'stopped'
}

export const setRunStatus = (env: Environment, status: RunStatus): void => {
  env.config.set(SWARM_RUN_STATUS_KEY, status)
}

export class SwarmConfig extends EnvironmentConfig {
  get binPath(): ?string {
    return getBinPath(this._env)
  }

  set binPath(path: string) {
    setBinPath(this._env, path)
  }

  get socketPath(): string {
    return getSocketPath(this._env)
  }

  set socketPath(path: string) {
    setSocketPath(this._env, path)
  }

  get runStatus(): RunStatus {
    return getRunStatus(this._env)
  }

  set runStatus(status: RunStatus) {
    setRunStatus(this._env, status)
  }
}
