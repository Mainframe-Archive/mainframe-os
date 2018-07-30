// @flow

import { Command, flags } from '@oclif/command'

import { startServer, stopServer } from '../../'

export default class StartCommand extends Command {
  static flags = {
    env: flags.string({
      char: 'e',
      description: 'environment name',
      required: true,
    }),
  }

  async run() {
    const { flags } = this.parse(StartCommand)
    this.log(`Starting daemon with environment ${flags.env}`)

    await startServer(flags.env)
    this.log(`Daemon started`)

    process.on('SIGINT', async () => {
      this.log(`Stopping daemon`)
      await stopServer(flags.env)

      this.log(`Daemon stopped`)
      process.exit(0)
    })
  }
}
