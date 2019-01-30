// @flow

import { flags } from '@oclif/command'

import Command from '../../OpenVaultCommand'

export default class AppPublishCommand extends Command {
  static description = 'Publish app'
  static flags = {
    ...Command.flags,
    id: flags.string({
      description: 'app local ID',
    }),
    version: flags.string({
      description: 'version to publish',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    const res = await client.app.publish({
      appID: this.flags.id,
      version: this.flags.version,
    })
    this.log(`App published with Swarm hash ${res.hash}`)
  }
}
