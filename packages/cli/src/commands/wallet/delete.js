// @flow
import { flags } from '@oclif/command'
import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class WalletDeleteCommand extends Command {
  static description = 'Delete wallet'
  static flags = {
    ...Command.flags,
    id: flags.string({
      description: 'wallet local ID',
    }),
    type: flags.string({
      description: 'wallet local type (hd or ledger)',
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
      await client.wallet.deleteWallet({
        localID: this.flags.id,
        type: this.flags.type,
        chain: 'ethereum',
      })

      this.log(`Removed wallet: ${this.flags.id}`)
    }
  }
}
