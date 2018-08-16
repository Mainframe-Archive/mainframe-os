// @flow

import { getDefaultVault } from '@mainframe/config'

import Command from './Command'
import { promptOpenVault } from './prompts'

export default class OpenVaultCommand extends Command {
  static flags = Command.flags

  async init() {
    await super.init()

    const client = this.client
    if (client == null) {
      return
    }

    const vault = this.flags.vault || getDefaultVault(this.env)
    if (vault == null) {
      throw new Error('No vault provided or found')
    }

    const vaultPassword = await promptOpenVault()
    await client.openVault(vault, vaultPassword)
  }
}
