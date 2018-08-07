// @flow

import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class AppCreateCommand extends Command {
  static description = 'Create app'
  static flags = Command.flags

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    // TODO: add developerID selection
    const answers = await prompt([
      {
        type: 'input',
        name: 'path',
        message: 'Contents folder path:',
        default: '.',
      },
      {
        type: 'input',
        name: 'name',
        message: 'App name:',
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: '1.0.0',
      },
    ])

    if (answers.path.length === 0) {
      throw new Error('Contents folder must be provided')
    }

    const res = await client.createApp({
      contentsPath: this.resolvePath(answers.path),
      name: answers.name,
      version: answers.version,
    })

    this.log(`App created with ID ${res.id}`)
  }
}
