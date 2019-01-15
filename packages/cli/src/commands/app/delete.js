// @flow
import { flags } from '@oclif/command'

import Command from '../../OpenVaultCommand'

export default class AppDeleteCommand extends Command {
  static description = 'Delete app'
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

    await client.app.remove({
      appID: this.flags.id,
    })

    this.log(`Removed app: ${this.flags.id}`)
  }
}
