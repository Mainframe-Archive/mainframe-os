// @flow

import { VaultConfig } from '@mainframe/config'

import Command from '../../Command'

export default class CreateCommand extends Command {
  async run() {
    const cfg = new VaultConfig(this.env)
    const vaults = cfg.vaults
    this.log(Object.keys(vaults))
  }
}
