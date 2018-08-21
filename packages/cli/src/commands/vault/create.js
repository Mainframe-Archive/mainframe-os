// @flow

import { VaultConfig } from '@mainframe/config'

import Command from '../../Command'

export default class CreateCommand extends Command {
  static description = 'Create a vault'
  static flags = Command.flags

  async run() {
    const cfg = new VaultConfig(this.env)
    const path = this.flags.vault || cfg.createVaultPath()

    if (this.client == null) {
      return
    }

    await this.createVault(cfg, path, cfg.defaultVault == null)
    this.log(`New vault created at ${path}`)
  }
}
