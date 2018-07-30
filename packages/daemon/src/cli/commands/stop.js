// @flow

import { Command, flags } from '@oclif/command'

import { stopServer } from '../../'

export default class StopCommand extends Command {
  static flags = {
    env: flags.string({
      char: 'e',
      description: 'environment name',
      required: true,
    }),
  }

  async run() {
    const { flags } = this.parse(StopCommand)
    await stopServer(flags.env)
  }
}
