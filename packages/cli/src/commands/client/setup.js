// @flow

import { VaultConfig } from '@mainframe/config'
import { prompt } from 'inquirer'

import Command from '../../Command'

export default class SetupCommand extends Command {
  static description = 'Setup the client'
  static flags = Command.flags

  async createDefaultVault(cfg: VaultConfig) {
    const path = cfg.createVaultPath()
    await this.createVault(cfg, path, true)
    this.log(`New vault created at ${path}`)
  }

  async run() {
    const cfg = new VaultConfig(this.env)
    if (cfg.defaultVault != null) {
      this.log('The default vault is set, no further setup is required')
      return
    }

    const vaults = cfg.vaults
    const vaultsPaths = Object.keys(vaults)

    if (vaultsPaths.length === 0) {
      // No existing vault, ask to create one
      const { create } = await prompt([
        {
          type: 'confirm',
          name: 'create',
          message: 'Would you like to create a new vault?',
          default: true,
        },
      ])
      if (create) {
        this.createDefaultVault(cfg)
      }
      return
    }

    // Create list of possible vaults to set as default
    const choices = vaultsPaths.reduce((acc, path) => {
      acc.push({ name: `${vaults[path]} (${path})`, value: path })
      return acc
    }, [])
    // Add extra option for new vault creation
    choices.push({ name: 'Create a new vault', value: true })
    const { choice } = await prompt([
      {
        type: 'list',
        choices,
        name: 'choice',
        message: 'Select a vault to use by default',
      },
    ])

    if (choice === true) {
      // Create new vault
      this.createDefaultVault(cfg)
    } else {
      // Set choice as default vault
      cfg.defaultVault = choice
      this.log(`Default vault set to ${vaults[choice]} (${choice})`)
    }
  }
}
