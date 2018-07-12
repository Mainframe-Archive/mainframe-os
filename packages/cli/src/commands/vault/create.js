// @flow

import { VaultConfig } from '@mainframe/config'
import { flags } from '@oclif/command'

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
    const cfg = new VaultConfig(this.env)
    const path = this.flags.path || cfg.createVaultPath()

    await createVault(this, cfg, path, cfg.defaultVault == null)
    this.log(`New vault created at ${path}`)
  }
}
