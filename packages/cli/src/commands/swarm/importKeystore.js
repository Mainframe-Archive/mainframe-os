// @flow

import { importKeyStore } from '@mainframe/toolbox'

import Command from '../../Command'
import { flags } from '@oclif/command'

export default class ImportKeystoreCommand extends Command {
  static description = 'Create a new Ethereum keystore file'
  static flags = {
    ...Command.flags,
    address: flags.string({
      description: 'Ethereum address you would like to import keystore for',
    }),
  }

  async run() {
    const keyObject = await importKeyStore(this.flags['address'])
    this.log(keyObject)
  }
}
