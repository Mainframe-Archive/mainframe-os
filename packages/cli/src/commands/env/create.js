// @flow

import { Environment } from '@mainframe/config'
import { Command, flags } from '@oclif/command'
import { prompt } from 'inquirer'

const ENV_TYPES = ['development', 'production', 'testing']

export default class CreateCommand extends Command {
  static description = 'Create a new environment'
  static flags = {
    name: flags.string({
      char: 'n',
      description: 'environment name',
    }),
    type: flags.string({
      char: 't',
      description: 'environment type',
      options: ENV_TYPES,
    }),
    default: flags.boolean({
      char: 'd',
      description: 'use as default environment',
    }),
  }

  async run() {
    const { flags } = this.parse(CreateCommand)

    const prompts = []
    if (flags.name == null) {
      prompts.push({
        type: 'input',
        name: 'name',
        message: 'Environment name',
      })
    }
    if (flags.type == null) {
      prompts.push({
        type: 'list',
        choices: ENV_TYPES,
        default: 'development',
        name: 'type',
        message: 'Select the environment type',
      })
    }
    if (flags.default == null) {
      prompts.push({
        type: 'confirm',
        default: Environment.getDefault() == null,
        name: 'default',
        message: 'Use as default environment?',
      })
    }

    const choices = await prompt(prompts)
    const name = flags.name || choices.name
    const type = flags.type || choices.type

    if (name == null || type == null) {
      this.warn('Could not create environment')
    } else {
      const env = Environment.create(
        name,
        type,
        flags.default == null ? choices.default : flags.default,
      )
      this.log(`Environment ${env.name} (${env.type}) has been created`)
    }
  }
}
