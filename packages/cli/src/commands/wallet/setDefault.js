// @flow
import { flags } from '@oclif/command'
import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class WalletSetDefaultCommand extends Command {
  static description = 'Set default wallet for user'
  static flags = {
    ...Command.flags,
    userID: flags.string({
      description: 'wallet local ID',
    }),
    address: flags.string({
      description: 'wallet account address',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }
    const { confirmed } = await prompt({
      type: 'confirm',
      name: 'confirmed',
      message: `Are you sure you want to delete the wallet "${
        this.flags.id
      }"? This CAN NOT be reversed.`,
      default: false,
    })
    if (confirmed) {
      await client.wallet.setUsersDefaultWallet({
        userID: this.flags.userID,
        address: this.flags.address,
      })

      this.log('Added wallet')
    }
  }
}
