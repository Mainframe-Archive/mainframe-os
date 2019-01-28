// @flow

import { createKeyStore } from '@mainframe/toolbox'

import { flags } from '@oclif/command'
import Command from '../../Command'

export default class CreateKeystoreCommand extends Command {
  static description = 'Create a new Ethereum keystore file'
  static flags = {
    ...Command.flags,
    password: flags.string({
      description: 'Create a password for your keystore',
    }),
  }

  async run() {
    const address = await createKeyStore(this.flags['password'])
    this.log(`Ethereum keystore file created, new address: ${address}`)
  }
}
