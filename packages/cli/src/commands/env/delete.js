// @flow

import { Environment } from '@mainframe/config'
import { Command, flags } from '@oclif/command'
import { prompt } from 'inquirer'

export default class DeleteCommand extends Command {
  static description = 'Delete an environment'
  static flags = {
    name: flags.string({
      char: 'n',
      description: 'environment name',
      required: true,
    }),
    confirm: flags.boolean({
      char: 'c',
      description: 'confirm deletion (no prompt)',
    }),
  }

  async run() {
    const { flags } = this.parse(DeleteCommand)

    let confirm = flags.confirm
    if (!confirm) {
      const choices = await prompt({
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete the "${
          flags.name
        }" environment? This CAN NOT be reversed.`,
        default: false,
      })
      confirm = choices.confirm
    }

    if (confirm) {
      await Environment.destroy(flags.name)
    }
  }
}
