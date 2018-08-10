// @flow

import { flags } from '@oclif/command'

import Command from '../../OpenVaultCommand'

export default class AppWriteManifestCommand extends Command {
  static description = 'Write app manifest'
  static flags = {
    ...Command.flags,
    id: flags.string({
      description: 'app local ID',
    }),
    path: flags.string({
      description: 'path of the manifest file to write',
      default: './manifest.json',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    await client.writeAppManifest({
      appID: this.flags.id,
      path: this.resolvePath(this.flags.path),
    })
    this.log(`App manifest written to ${this.flags.path}`)
  }
}
