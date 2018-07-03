// @flow

import type { VaultConfig } from '@mainframe/config'
import { prompt } from 'inquirer'

import type Command from './Command'

export const promptVault = async (setDefault: ?boolean = false) => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'label',
      message: 'Vault label',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Vault password (make it secure!)',
    },
    {
      type: 'password',
      name: 'confirmation',
      message: 'Vault password (confirmation)',
    },
    {
      type: 'confirm',
      name: 'setDefault',
      message: 'Set as default vault?',
      default: setDefault,
    },
  ])

  if (answers.label.length === 0) {
    throw new Error('Label must be provided')
  }
  if (answers.password !== answers.confirmation) {
    throw new Error('Password and confirmation do not match')
  }

  return {
    label: answers.label,
    setDefault: answers.setDefault,
    password: answers.password,
  }
}

export const createVault = async (
  cmd: Command,
  cfg: VaultConfig,
  path: string,
  setDefault: ?boolean = false,
): Promise<void> => {
  const client = cmd.createClient()
  if (client == null) {
    return
  }

  let vault
  while (vault == null) {
    try {
      vault = await promptVault(setDefault)
    } catch (err) {
      cmd.warn(err)
    }
  }

  await client.createVault(path, vault.password)
  client.close()

  // Update config after successful creation by daemon
  cfg.setLabel(path, vault.label)
  if (vault.setDefault) {
    cfg.defaultVault = path
  }
}
