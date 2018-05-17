// @flow

import { Command, flags } from '@oclif/command'

import { stopServer } from '../../'

export default class StopCommand extends Command {
  static flags = {
    path: flags.string({
      char: 'p',
      description: 'socket path',
      required: true,
    }),
  }

  async run() {
    const { flags } = this.parse(StopCommand)
    await stopServer(flags.path)
  }
}
