// @flow

import { listKeyStores } from '@mainframe/toolbox'

import Command from '../../Command'

export default class ListKeystoresCommand extends Command {
  static description = 'List all existing keystores'

  async run() {
    const keystores = await listKeyStores()
    this.log('')
    this.log('Keystore data:')
    this.log(keystores)
  }
}
