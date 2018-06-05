// @flow

import { Environment } from '@mainframe/config'
import { Command, flags } from '@oclif/command'

export default class DefaultCommand extends Command {
  static description = 'Get or set the default environment'
  static flags = {
    set: flags.string({
      char: 's',
      description: 'environment name to use as default',
    }),
  }

  async run() {
    const { flags } = this.parse(DefaultCommand)
    if (flags.set != null && flags.set.length > 0) {
      Environment.setDefault(flags.set)
      this.log(`"${flags.set}" is set to the default environment`)
    } else {
      const env = Environment.getDefault()
      if (env == null) {
        // TODO: check if existing envs, prompt to use or create one
        this.warn(
          'No default environment set, use the --set flag to provide one',
        )
      } else {
        this.log(`"${env}" is the default environment`)
      }
    }
  }
}
