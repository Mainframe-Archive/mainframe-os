// @flow

import Command from '../../OpenVaultCommand'

export default class IdentityCreateCommand extends Command {
  static description = 'Create Ethereum wallet'
  static flags = Command.flags

  async run() {
    if (this.client == null) {
      return
    }
    const res = await this.client.wallet.createHDWallet({ chain: 'ethereum' })
    this.log(res)
  }
}
