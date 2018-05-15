// @flow

import { Environment } from '@mainframe/config'
import { Command as Cmd, flags } from '@oclif/command'

export default class Command extends Cmd {
  static flags = {
    env: flags.string({
      char: 'e',
      default: 'development',
      description: 'Mainframe environment to run the command in',
      env: 'MAINFRAME_ENV',
      options: ['development', 'production'],
    }),
  }

  async init() {
    const { flags } = this.parse(this.constructor)
    this.env = new Environment(flags.env)
    this.flags = flags
  }
}
