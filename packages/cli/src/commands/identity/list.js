// @flow

import { prompt } from 'inquirer'

import Command from '../../OpenVaultCommand'

export default class IdentityListCommand extends Command {
  static description = 'List Identities'
  static flags = Command.flags

  async run() {
    const func = await promptSelectCommand()
    // $FlowFixMe: indexer property
    const res = await this.client.identity[func]()
    Object.keys(res).forEach(type => {
      res[type].forEach(identity => {
        this.log('\nid: ', identity.id)
        this.log('localID: ', identity.localID)
        this.log('feedHash: ', identity.feedHash)
        this.log('data: ', identity.profile)
      })
    })
  }
}

const promptSelectCommand = async () => {
  const identityListMethods = {
    'Own Developers': 'getOwnDevelopers',
    'Own Users': 'getOwnUsers',
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
