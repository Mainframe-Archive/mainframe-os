// @flow

import type Environment from './Environment'
import EnvironmentConfig from './EnvironmentConfig'
import type { InstallStatus, RunStatus } from './types'

export const DAEMON_BIN_PATH_KEY = 'daemon.bin_path'
export const DAEMON_SOCKET_PATH_KEY = 'daemon.socket_path'
export const DAEMON_INSTALL_STATUS_KEY = 'daemon.install_status'
export const DAEMON_RUN_STATUS_KEY = 'daemon.run_status'

export const getDaemonBinPath = (env: Environment): ?string => {
  return env.config.get(DAEMON_BIN_PATH_KEY)
}

export const setDaemonBinPath = (env: Environment, path: string): void => {
  env.config.set(DAEMON_BIN_PATH_KEY, path)
}

export const getDaemonSocketPath = (env: Environment): string => {
  return (
    env.config.get(DAEMON_SOCKET_PATH_KEY) ||
    env.createSocketPath('mainframe.ipc')
  )
}

export const setDaemonSocketPath = (env: Environment, path: string): void => {
  env.config.set(DAEMON_SOCKET_PATH_KEY, path)
}

export const getDaemonInstallStatus = (env: Environment): InstallStatus => {
  return env.config.get(DAEMON_INSTALL_STATUS_KEY) || 'unknown'
}

export const setDaemonInstallStatus = (
  env: Environment,
  status: InstallStatus,
): void => {
  env.config.set(DAEMON_INSTALL_STATUS_KEY, status)
}

export const createWhenDaemonInstallStatus = (env: Environment) => {
  return env.createWhenValue(DAEMON_INSTALL_STATUS_KEY)
}

export const getDaemonRunStatus = (env: Environment): RunStatus => {
  return env.config.get(DAEMON_RUN_STATUS_KEY) || 'stopped'
}

export const setDaemonRunStatus = (
  env: Environment,
  status: RunStatus,
): void => {
  env.config.set(DAEMON_RUN_STATUS_KEY, status)
}

export const createWhenDaemonRunStatus = (env: Environment) => {
  return env.createWhenValue(DAEMON_RUN_STATUS_KEY)
}

export class DaemonConfig extends EnvironmentConfig {
  whenInstallStatus: (status: InstallStatus) => Promise<any>
  whenRunStatus: (status: RunStatus) => Promise<any>

  constructor(env: Environment) {
    super(env)
    this.whenInstallStatus = createWhenDaemonInstallStatus(env)
    this.whenRunStatus = createWhenDaemonRunStatus(env)
  }

  get binPath(): ?string {
    return getDaemonBinPath(this._env)
  }

  set binPath(path: string) {
    setDaemonBinPath(this._env, path)
  }

  get socketPath(): string {
    return getDaemonSocketPath(this._env)
  }

  set socketPath(path: string) {
    setDaemonSocketPath(this._env, path)
  }

  get installStatus(): InstallStatus {
    return getDaemonInstallStatus(this._env)
  }

  set installStatus(status: InstallStatus) {
    setDaemonInstallStatus(this._env, status)
  }

  get runStatus(): RunStatus {
    return getDaemonRunStatus(this._env)
  }

  set runStatus(status: RunStatus) {
    setDaemonRunStatus(this._env, status)
  }
}
