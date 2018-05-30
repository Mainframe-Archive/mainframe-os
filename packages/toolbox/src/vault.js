// @flow

import type { VaultConfig } from '@mainframe/config'
import { remove } from 'fs-extra'

export const deleteVault = async (
  cfg: VaultConfig,
  path: string,
): Promise<void> => {
  await remove(path)
  cfg.setLabel(path, null)
  if (cfg.defaultVault === path) {
    cfg.defaultVault = null
  }
}
