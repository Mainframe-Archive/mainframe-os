// @flow

import { prompt } from 'inquirer'
import fs from 'fs'

import Command from '../../OpenVaultCommand'
import { stat } from 'fs-extra-p';

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
        default: './',
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
    const contentsPath = this.resolvePath(answers.path)

    if (answers.path.length === 0) {
      throw new Error('Contents folder must be provided')
    }

    if (!fs.existsSync(contentsPath)) {
      throw new Error(`Contents folder needs to exist (${contentsPath} is missing)`)
    }

    const stats = fs.lstatSync(contentsPath)
    if (!stats.isDirectory()) {
      throw new Error(`Contents folder needs to be a folder (${contentsPath} isn't a folder)`)
    }

    const res = await client.app.create({
      contentsPath: contentsPath,
      name: answers.name,
      version: answers.version,
    })

    this.log(`App created with ID ${res.appID}`)
  }
}
