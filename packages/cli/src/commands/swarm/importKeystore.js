// @flow

import { importKeyStore } from '@mainframe/toolbox'

import Command from '../../Command'

export default class ImportKeystoreCommand extends Command {
  static description = 'Create a new Ethereum keystore file'

  async run() {
    const keyObject = await importKeyStore()
    this.log(`${keyObject}`)
  }
}
