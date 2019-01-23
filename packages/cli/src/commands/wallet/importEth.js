// @flow

import type Client from '@mainframe/client'
import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class ImportEthWalletCommand extends Command {
  static description = 'Import ethereum wallet'

  async run() {
    if (this.client == null) {
      return
    }
    const command = await promptSelectCommand()
    await walletImportOptions[command](this, this.client)
  }
}

export const promptImportMnemonic = async (): Promise<string> => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'Mnemonic',
      message: 'Enter 12 word mnemonic phrase:',
    },
  ])

  if (answers.Mnemonic.length === 0) {
    throw new Error('Please provide a mnemoic pass phrase.')
  }

  return answers.Mnemonic
}

export const promptAccountName = async (): Promise<string> => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Account name:',
    },
  ])

  if (answers.name.length === 0) {
    throw new Error('Please provide a name.')
  }

  return answers.name
}

export const importMnemonic = async (cmd: Command, client: Client) => {
  const mnemonic = await promptImportMnemonic()
  const name = await promptAccountName()

  const res = await client.wallet.importWalletByMnemonic({
    mnemonic,
    firstAccountName: name,
    blockchain: 'ethereum',
  })
  client.close()
  cmd.log('Imported HD wallet:')
  cmd.log(res)
}

const walletImportOptions = {
  Mnemonic: importMnemonic,
  //TODO 'Private key': importPrivateKey,
}

const promptSelectCommand = async () => {
  const answers = await prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Wallet type:',
      choices: Object.keys(walletImportOptions),
    },
  ])
  return answers.command
}
