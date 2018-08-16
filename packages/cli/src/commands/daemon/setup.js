// @flow

import { DaemonConfig } from '@mainframe/config'
import { setupDaemon } from '@mainframe/toolbox'
import { flags } from '@oclif/command'

import Command from '../../Command'

export default class SetupCommand extends Command {
  static description = 'Setup the daemon configuration'
  static flags = {
    ...Command.flags,
    'bin-path': flags.string({
      description: 'path to the daemon binary',
    }),
    'socket-path': flags.string({
      description: 'path to the daemon socket',
    }),
  }

  async run() {
    const binPath = this.flags['bin-path']
    const socketPath = this.flags['socket-path']
    setupDaemon(new DaemonConfig(this.env), {
      binPath: binPath ? this.resolvePath(binPath) : undefined,
      socketPath: socketPath ? this.resolvePath(socketPath) : undefined,
    })
  }
}
