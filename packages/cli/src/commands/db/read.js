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
    if (!this.flags['uuid']) {
      throw new Error('uuid is required. e.g. sometablename')
    }

    if (!this.flags['key']) {
      throw new Error('key is required. e.g. somekey')
    }
    
    try {
      const value = await this.client.bluzelle.read({
        uuid: this.flags['uuid'],
        key: this.flags['key']
      })
      this.log(value)
    } catch(err) {
      if (err.message === 'RECORD_NOT_FOUND') {
        this.error('Record not found')
      } else {
        throw err
      }
    }
  }
}
