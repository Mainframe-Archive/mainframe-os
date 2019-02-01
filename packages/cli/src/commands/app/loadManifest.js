// @flow

import Command from '../../OpenVaultCommand'

export default class AppLoadManifestCommand extends Command {
  static description = 'Load app manifest'
  static args = [
    {
      name: 'hash',
      description: 'Swarm hash of the app manifest',
      required: true,
    },
  ]
  static flags = Command.flags

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    const res = await client.app.loadManifest({ hash: this.args.hash })
    this.logObject(res)
  }
}
