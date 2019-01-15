// @flow

import { createKeyStore } from '@mainframe/toolbox'

import Command from '../../Command'

export default class CreateKeystoreCommand extends Command {
  static description = 'Create a new Ethereum keystore file'

  async run() {
    const address = await createKeyStore()
    this.log(`Ethereum keystore file created, new address: ${address}`)
  }
}
