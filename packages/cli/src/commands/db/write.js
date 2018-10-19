// @flow

import { flags } from '@oclif/command'

import { VaultConfig } from '@mainframe/config'

import Command from '../../OpenVaultCommand'

export default class WriteCommand extends Command {
  static description = 'Create a key/value pair in a decentralized database (Bluzelle)'
  static flags = {
    ...Command.flags,
    'uuid': flags.string({
      description: 'UUID of the database keystore',
    }),
    'key': flags.string({
      description: 'Key for key/value pair',
    }),
    'value': flags.string({
      description: 'Value for key/value pair',
    }),
  }

  async run() {
    if (!this.flags['uuid']) {
      throw new Error('uuid is required. e.g. sometablename')
    }

    if (!this.flags['key']) {
      throw new Error('key is required. e.g. somekey')
    }

    if (!this.flags['value']) {
      throw new Error('value is required. e.g. "hello world"')
    }
    
    this.client.bluzelle.write({
      uuid: this.flags['uuid'],
      key: this.flags['key'],
      value: this.flags['value']
    })
  }
}
