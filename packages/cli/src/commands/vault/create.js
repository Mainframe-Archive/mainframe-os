// @flow

import { VaultConfig, type Environment } from '@mainframe/config'
import { flags } from '@oclif/command'
import { prompt } from 'inquirer'

import Command from '../../Command'
import { createVault } from '../../vault'

export default class CreateCommand extends Command {
  static description = 'Create a vault'
  static flags = {
    ...Command.flags,
    path: flags.string({
      char: 'p',
      description: 'vault path',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    const cfg = new VaultConfig(this.env)
    const path = this.flags.path || cfg.createVaultPath()

    await createVault(cfg, client, path, cfg.defaultVault == null)
    this.log(`New vault created at ${path}`)
  }
}
