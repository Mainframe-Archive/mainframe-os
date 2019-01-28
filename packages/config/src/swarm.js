// @flow

import type Environment from './Environment'
import EnvironmentConfig from './EnvironmentConfig'
import type { RunStatus } from './types'

export const SWARM_BIN_PATH_KEY = 'swarm.bin_path'
export const SWARM_SOCKET_PATH_KEY = 'swarm.socket_path'
export const SWARM_RUN_STATUS_KEY = 'swarm.run_status'

export const getSwarmBinPath = (env: Environment): ?string => {
  return env.config.get(SWARM_BIN_PATH_KEY)
}

export const setSwarmBinPath = (env: Environment, path: string): void => {
  env.config.set(SWARM_BIN_PATH_KEY, path)
}

export const getSwarmSocketPath = (env: Environment): string => {
  return (
    env.config.get(SWARM_SOCKET_PATH_KEY) ||
    env.createSocketPath('mainframe.ipc')
  )
}

export const setSwarmSocketPath = (env: Environment, path: string): void => {
  env.config.set(SWARM_SOCKET_PATH_KEY, path)
}

export const getSwarmRunStatus = (env: Environment): RunStatus => {
  return env.config.get(SWARM_RUN_STATUS_KEY) || 'stopped'
}

export const setSwarmRunStatus = (
  env: Environment,
  status: RunStatus,
): void => {
  env.config.set(SWARM_RUN_STATUS_KEY, status)
}

export const createWhenSwarmRunStatus = (env: Environment) => {
  return env.createWhenValue(SWARM_RUN_STATUS_KEY)
}

export class SwarmConfig extends EnvironmentConfig {
  get binPath(): ?string {
    return getSwarmBinPath(this._env)
  }

  set binPath(path: string) {
    setSwarmBinPath(this._env, path)
  }

  get socketPath(): string {
    return getSwarmSocketPath(this._env)
  }

  set socketPath(path: string) {
    setSwarmSocketPath(this._env, path)
  }

  get runStatus(): RunStatus {
    return getSwarmRunStatus(this._env)
  }

  set runStatus(status: RunStatus) {
    setSwarmRunStatus(this._env, status)
  }
}
