// @flow

import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class IdentityListCommand extends Command {
  static description = 'Manage Identities'
  static flags = Command.flags

  async run() {
    const client = this.createClient()
    if (client == null) {
      return
    }
    const func = await promptSelectCommand()
    // $FlowFixMe: indexer property
    const res = await client[func]()
    Object.keys(res).forEach(type => {
      res[type].forEach(identity => {
        this.log('\nid: ', identity.id)
        this.log('data: ', identity.data)
      })
    })
  }
}

const promptSelectCommand = async () => {
  const identityListMethods = {
    'Own Developers': 'getOwnDeveloperIdentities',
    'Own Users': 'getOwnUserIdentities',
  }
  const answers = await prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Select identity type:',
      choices: Object.keys(identityListMethods),
    },
  ])
  return identityListMethods[answers.command]
}
