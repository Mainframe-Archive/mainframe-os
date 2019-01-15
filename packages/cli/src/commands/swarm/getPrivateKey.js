// @flow

import { getPrivateKey } from '@mainframe/toolbox'
import { flags } from '@oclif/command'

import Command from '../../Command'

export default class GetPrivateKeyCommand extends Command {
  static description = 'Get the private key from given keystore'
  static flags = {
    ...Command.flags,
    address: flags.string({
      description: 'Ethereum address you would like the private key for',
    }),
    encoding: flags.string({
      description: 'The encoding to use on the private key value',
    }),
  }

  async run() {
    const address = this.flags['address']
    const encoding = this.flags['encoding']
    const privKey = await getPrivateKey(address, encoding)
    this.log('')
    this.log('Private key:')
    this.log(privKey)
  }
}
