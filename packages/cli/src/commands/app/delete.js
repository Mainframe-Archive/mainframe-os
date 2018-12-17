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
    isOwn: flags.boolean({
      description: 'boolean flag for own app type',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    if (this.flags.isOwn) {
      await client.app.removeOwn({
        appID: this.flags.id,
      })
    } else {
      await client.app.remove({
        appID: this.flags.id,
      })
    }

    this.log(`Removed app: ${this.flags.id}`)
  }
}
