// @flow

import { prompt } from 'inquirer'
import { flags } from '@oclif/command'

import Command from '../../OpenVaultCommand'

const permissionOptions = {
  WEB_REQUEST: 'Web Request',
  SWARM_DOWNLOAD: 'Download from Swarm',
  SWARM_UPLOAD: 'Upload to Swarm',
  BLOCKCHAIN_SEND: 'Make Blockchain Transactions',
}

export default class SetPermissionsCommand extends Command {
  static description = 'Create app'
  static flags = {
    ...Command.flags,
    id: flags.string({
      description: 'app local ID',
    }),
  }
  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    if (!this.flags.id) {
      this.log('Please provide an app ID (--id <APP_ID>)')
      return
    }

    const permissionRequirements = {
      optional: {
        WEB_REQUEST: [],
      },
      required: {
        WEB_REQUEST: [],
      },
    }

    const requestPermissionSettings = async () => {
      const answers = await prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Select permission type:\n',
          choices: Object.values(permissionOptions),
        },
        {
          type: 'list',
          name: 'required',
          message: 'Is this a required permission:',
          choices: ['optional', 'required'],
        },
      ])
      if (answers.type === permissionOptions.WEB_REQUEST) {
        const hostAnswers = await prompt([
          {
            type: 'input',
            name: 'host',
            message: 'Domain (e.g: google.com):',
          },
        ])
        permissionRequirements[answers.required].WEB_REQUEST.push(
          hostAnswers.host,
        )
      } else {
        const key = Object.keys(permissionOptions).find(
          k => permissionOptions[k] === answers.type,
        )
        //$FlowFixMe type keys
        permissionRequirements[answers.required][key] = true
      }
      const againAnswers = await prompt([
        {
          type: 'confirm',
          name: 'again',
          message: 'Add more permissions?',
        },
      ])
      if (againAnswers.again) {
        await requestPermissionSettings()
      }
    }

    await requestPermissionSettings()

    const versionAnswer = await prompt([
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: '1.0.0',
      },
    ])

    await client.app.setPermissionsRequirements({
      appID: this.flags.id,
      permissions: permissionRequirements,
      version: versionAnswer.version,
    })
    this.log(`Permission requirements saved.`)
  }
}
