// @flow

import { flags } from '@oclif/command'
import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class CreateEthWalletCommand extends Command {
  static description = 'Create Ethereum wallet'
  static flags = {
    ...Command.flags,
    userID: flags.string({
      description: 'link wallet to a user',
    }),
  }

  async run() {
    const answers = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Wallet name:',
      },
    ])

    if (!answers.name.length) {
      throw new Error('Please provide a name.')
    }

    if (this.client) {
      const res = await this.client.wallet.createHDWallet({
        chain: 'ethereum',
        name: answers.name,
      })

      if (this.flags.userID && this.client) {
        await this.client.identity.linkEthWalletAccount({
          id: this.flags.userID,
          walletID: res.localID,
          address: res.accounts[0].address,
        })
      }
      this.log(res)
    }
  }
}
