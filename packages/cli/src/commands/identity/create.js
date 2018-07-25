// @flow

import type Client from '@mainframe/client'
import { prompt } from 'inquirer'

import Command from '../../Command'
import { openDefaultVault } from '../../vault'

export default class IdentityCreateCommand extends Command {
  static description = 'Manage Identities'

  async run() {
    const client = this.createClient()
    if (client == null) {
      return
    }
    await openDefaultVault(this, client)
    const command = await promptSelectCommand()
    const res = await identityCreateCommands[command](this, client)
    this.log(res)
  }
}

export const promptCreateDeveloper = async () => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Developer name:',
    },
  ])

  if (answers.name.length === 0) {
    throw new Error('Name must be provided')
  }

  return {
    name: answers.name,
  }
}

export const promptCreateUser = async () => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Name of user:',
    },
  ])

  if (answers.name.length === 0) {
    throw new Error('Name must be provided')
  }

  return {
    name: answers.name,
  }
}

export const createDeveloperIdentity = async (
  cmd: Command,
  client: Client,
): Promise<string> => {
  let data
  while (data == null) {
    try {
      data = await promptCreateDeveloper()
    } catch (err) {
      cmd.warn(err)
    }
  }

  const res = await client.createDeveloperIdentity(data)
  client.close()
  return `Created developer identity: ${res.id}`
}

export const createUserIdentity = async (
  cmd: Command,
  client: Client,
): Promise<string> => {
  let data
  while (data == null) {
    try {
      data = await promptCreateUser()
    } catch (err) {
      cmd.warn(err)
    }
  }

  const res = await client.createUserIdentity(data)
  client.close()
  return `Created user identity: ${res.id}`
}

const identityCreateCommands = {
  Developer: createDeveloperIdentity,
  User: createUserIdentity,
}

const promptSelectCommand = async () => {
  const answers = await prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Select identity type:',
      choices: Object.keys(identityCreateCommands),
    },
  ])
  return answers.command
}
