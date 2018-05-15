// @flow

import type Environment from './Environment'
import type { InstallStatus, RunStatus } from './types'

export const ETH_GETH_BIN_PATH_KEY = 'eth.geth_bin_path'
export const ETH_GETH_SOCKET_PATH_KEY = 'eth.geth_socket_path'
export const ETH_GETH_INSTALL_STATUS_KEY = 'eth.geth_install_status'
export const ETH_GETH_RUN_STATUS_KEY = 'eth.geth_run_status'
export const ETH_SWARM_BIN_PATH_KEY = 'eth.swarm_bin_path'
export const ETH_SWARM_INSTALL_STATUS_KEY = 'eth.swarm_install_status'
export const ETH_SWARM_RUN_STATUS_KEY = 'eth.swarm_run_status'

export const getGethBinPath = (env: Environment): string => {
  return env.config.get(ETH_GETH_BIN_PATH_KEY) || env.createBinPath('geth')
}

export const setGethBinPath = (env: Environment, path: string): void => {
  env.config.set(ETH_GETH_BIN_PATH_KEY, path)
}

export const getGethSocketPath = (env: Environment): string => {
  return (
    env.config.get(ETH_GETH_SOCKET_PATH_KEY) || env.createSocketPath('geth.ipc')
  )
}

export const setGethSocketPath = (env: Environment, path: string): void => {
  env.config.set(ETH_GETH_SOCKET_PATH_KEY, path)
}

export const getGethInstallStatus = (env: Environment): InstallStatus => {
  return env.config.get(ETH_GETH_INSTALL_STATUS_KEY) || 'unknown'
}

export const setGethInstallStatus = (
  env: Environment,
  status: InstallStatus,
): void => {
  env.config.set(ETH_GETH_INSTALL_STATUS_KEY, status)
}

export const createWhenGethInstallStatus = (env: Environment) => {
  return env.createWhenValue(ETH_GETH_INSTALL_STATUS_KEY)
}

export const getGethRunStatus = (env: Environment): RunStatus => {
  return env.config.get(ETH_GETH_RUN_STATUS_KEY) || 'stopped'
}

export const setGethRunStatus = (env: Environment, status: RunStatus): void => {
  env.config.set(ETH_GETH_RUN_STATUS_KEY, status)
}

export const createWhenGethRunStatus = (env: Environment) => {
  return env.createWhenValue(ETH_GETH_RUN_STATUS_KEY)
}

export const getSwarmBinPath = (env: Environment): string => {
  return env.config.get(ETH_SWARM_BIN_PATH_KEY) || env.createBinPath('swarm')
}

export const setSwarmBinPath = (env: Environment, path: string): void => {
  env.config.set(ETH_SWARM_BIN_PATH_KEY, path)
}

export const getSwarmInstallStatus = (env: Environment): InstallStatus => {
  return env.config.get(ETH_SWARM_INSTALL_STATUS_KEY) || 'unknown'
}

export const setSwarmInstallStatus = (
  env: Environment,
  status: InstallStatus,
): void => {
  env.config.set(ETH_SWARM_INSTALL_STATUS_KEY, status)
}

export const createWhenSwarmInstallStatus = (env: Environment) => {
  return env.createWhenValue(ETH_SWARM_INSTALL_STATUS_KEY)
}

export const getSwarmRunStatus = (env: Environment): RunStatus => {
  return env.config.get(ETH_SWARM_RUN_STATUS_KEY) || 'stopped'
}

export const setSwarmRunStatus = (
  env: Environment,
  status: RunStatus,
): void => {
  env.config.set(ETH_SWARM_RUN_STATUS_KEY, status)
}

export const createWhenSwarmRunStatus = (env: Environment) => {
  return env.createWhenValue(ETH_SWARM_RUN_STATUS_KEY)
}
