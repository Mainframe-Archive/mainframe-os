// @flow

import { flags } from '@oclif/command'
import Command from '../../OpenVaultCommand'

export default class IdentityCreateCommand extends Command {
  static description = 'Create Ethereum wallet'
  static flags = {
    ...Command.flags,
    userID: flags.string({
      description: 'link wallet to a user',
    }),
  }

  async run() {
    if (this.client == null) {
      return
    }
    const res = await this.client.wallet.createHDWallet({
      chain: 'ethereum',
      name: 'Account 1',
    })

    if (this.flags.userID && this.client) {
      await this.client.identity.linkEthWalletAccount({
        id: this.flags.userID,
        walletID: res.walletID,
        address: res.accounts[0],
      })
    }
    this.log(res)
  }
}
