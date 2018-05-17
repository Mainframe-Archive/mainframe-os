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
    setupDaemon(new DaemonConfig(this.env), {
      binPath: this.flags['bin-path'],
      socketPath: this.flags['socket-path'],
    })
  }
}
