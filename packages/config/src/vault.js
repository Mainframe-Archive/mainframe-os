// @flow

import { join } from 'path'
import { uniqueID } from '@mainframe/utils-id'

import type Environment from './Environment'
import EnvironmentConfig from './EnvironmentConfig'
import type { VaultsLabels } from './types'

export const VAULT_DEFAULT_KEY = 'vault.default'
export const VAULT_LABELS_KEY = 'vault.labels'

export const getDefaultVault = (env: Environment): ?string => {
  return env.config.get(VAULT_DEFAULT_KEY)
}

export const setDefaultVault = (env: Environment, path?: ?string): void => {
  if (path == null) {
    env.config.delete(VAULT_DEFAULT_KEY)
  } else {
    env.config.set(VAULT_DEFAULT_KEY, path)
  }
}

export const getVaultsLabels = (env: Environment): VaultsLabels => {
  return env.config.get(VAULT_LABELS_KEY) || {}
}

export const getVaultLabel = (env: Environment, path: string): ?string => {
  return env.config.get(`${VAULT_LABELS_KEY}.${path}`)
}

export const setVaultLabel = (
  env: Environment,
  path: string,
  label?: ?string,
): void => {
  const key = `${VAULT_LABELS_KEY}.${path}`
  if (label == null) {
    env.config.delete(key)
  } else {
    env.config.set(key, label)
  }
}

export const createVaultPath = (env: Environment): string => {
  return join(env.paths.config, 'vaults', uniqueID())
}

export class VaultConfig extends EnvironmentConfig {
  get vaults(): VaultsLabels {
    return getVaultsLabels(this._env)
  }

  get defaultVault(): ?string {
    return getDefaultVault(this._env)
  }

  set defaultVault(path: ?string): void {
    setDefaultVault(this._env, path)
  }

  getLabel(path: string): ?string {
    return getVaultLabel(this._env, path)
  }

  setLabel(path: string, label?: ?string): void {
    setVaultLabel(this._env, path, label)
  }

  createVaultPath(): string {
    return createVaultPath(this._env)
  }
}
