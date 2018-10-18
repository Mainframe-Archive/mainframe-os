// @flow

import { flags } from '@oclif/command'

import { VaultConfig } from '@mainframe/config'

import Command from '../../OpenVaultCommand'

export default class ReadCommand extends Command {
  static description = 'Read a key/value pair in a decentralized database (Bluzelle)'
  static flags = {
    ...Command.flags,
    'uuid': flags.string({
      description: 'UUID of the database keystore',
    }),
    'key': flags.string({
      description: 'Key for key/value pair',
    }),
  }
  async run() {
    this.client.bluzelle.read({
      uuid: this.flags['uuid'],
      key: this.flags['key']
    })
  }
}
