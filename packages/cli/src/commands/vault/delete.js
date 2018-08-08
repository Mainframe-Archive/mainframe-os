// @flow

import { VaultConfig } from '@mainframe/config'
import { deleteVault } from '@mainframe/toolbox'
import { flags } from '@oclif/command'
import { prompt } from 'inquirer'

import Command from '../../Command'

export default class DeleteCommand extends Command {
  static description = 'Delete a vault'
  static flags = {
    ...Command.flags,
    path: flags.string({
      char: 'p',
      description: 'vault path',
    }),
  }

  async deleteVault(cfg: VaultConfig, path: string) {
    const label = cfg.getLabel(path)
    const name = label ? `${label} (${path})` : path
    const { confirmed } = await prompt({
      type: 'confirm',
      name: 'confirmed',
      message: `Are you sure you want to delete the vault "${name}"? This CAN NOT be reversed.`,
      default: false,
    })
    if (confirmed) {
      await deleteVault(cfg, path)
      this.log(`Vault ${path} has been deleted`)
    }
  }

  async run() {
    const cfg = new VaultConfig(this.env)

    // When the path is provided as a flag, only try to delete this vault
    if (this.flags.path != null) {
      this.deleteVault(cfg, this.flags.path)
      return
    }

    // No path provided, check config
    const vaults = cfg.vaults
    const vaultsPaths = Object.keys(vaults)

    if (vaultsPaths.length === 0) {
      this.log('No vault stored in this environment')
      return
    }

    // Only one existing vault
    if (vaultsPaths.length === 1) {
      this.deleteVault(cfg, vaultsPaths[0])
      return
    }

    // Create list of possible vaults to delete
    const { selected } = await prompt([
      {
        type: 'checkbox',
        choices: vaultsPaths.reduce((acc, path) => {
          acc.push({ name: `${vaults[path]} (${path})`, value: path })
          return acc
        }, []),
        name: 'selected',
        message: 'Select the vault(s) to delete',
      },
    ])

    if (selected.length === 1) {
      await this.deleteVault(cfg, selected[0])
      return
    }

    if (selected.length > 1) {
      const { confirmed } = await prompt({
        type: 'confirm',
        name: 'confirmed',
        message: `Are you sure you want to delete these ${
          selected.length
        } vaults? This CAN NOT be reversed.`,
        default: false,
      })
      if (confirmed) {
        await Promise.all(selected.map(path => deleteVault(cfg, path)))
        this.log(`${selected.length} vaults have been deleted`)
      }
    }
  }
}
