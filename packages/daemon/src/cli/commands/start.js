// @flow

import { Command, flags } from '@oclif/command'

import { startServer, stopServer } from '../../'

export default class StartCommand extends Command {
  static flags = {
    path: flags.string({
      char: 'p',
      description: 'socket path',
      required: true,
    }),
  }

  async run() {
    const { flags } = this.parse(StartCommand)
    this.log(`Starting daemon with path ${flags.path}`)

    await startServer(flags.path)
    this.log(`Daemon started`)

    process.on('SIGINT', async () => {
      this.log(`Stopping daemon`)
      await stopServer(flags.path)

      this.log(`Daemon stopped`)
      process.exit(0)
    })
  }
}
