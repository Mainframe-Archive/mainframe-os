// @flow

import { flags } from '@oclif/command'

import Command from '../../OpenVaultCommand'

export default class AppPublishContentsCommand extends Command {
  static description = 'Publish app contents'
  static flags = {
    ...Command.flags,
    id: flags.string({
      description: 'app local ID',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    const res = await client.publishAppContents({
      appID: this.flags.id,
    })
    this.log(`App contents published with URI ${res.contentsURI}`)
  }
}
