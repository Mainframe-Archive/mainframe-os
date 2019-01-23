// @flow

import { flags } from '@oclif/command'
import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class ConnectLedgerWalletCommand extends Command {
  static description = 'Connect Ledger Eth Wallet'
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
      {
        type: 'input',
        name: 'index',
        message: 'Account index:',
      },
    ])

    if (!answers.name.length) {
      throw new Error('Please provide a name.')
    }

    if (this.client) {
      const res = await this.client.wallet.addLedgerEthAccount({
        index: Number(answers.index),
        name: answers.name,
      })

      if (this.flags.userID && this.client) {
        await this.client.identity.linkEthWalletAccount({
          id: this.flags.userID,
          walletID: res.localID,
          address: res.address,
        })
      }
      this.log(res)
    }
  }
}
