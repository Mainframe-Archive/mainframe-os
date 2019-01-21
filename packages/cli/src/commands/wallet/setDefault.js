// @flow
import { flags } from '@oclif/command'

import Command from '../../OpenVaultCommand'

export default class WalletSetDefaultCommand extends Command {
  static description = 'Set default wallet for user'
  static flags = {
    ...Command.flags,
    userID: flags.string({
      description: 'user local ID',
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
    await client.wallet.setUsersDefaultWallet({
      userID: this.flags.userID,
      address: this.flags.address,
    })

    this.log('Default wallet set')
  }
}
