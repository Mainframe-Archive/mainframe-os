// @flow

import type Client from '@mainframe/client'
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
      name: 'passphrase',
      message: 'Vault passphrase (make it long!)',
    },
    {
      type: 'password',
      name: 'confirmation',
      message: 'Vault passphrase (confirmation)',
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
  if (answers.passphrase !== answers.confirmation) {
    throw new Error('Passphrase and confirmation do not match')
  }

  return {
    label: answers.label,
    setDefault: answers.setDefault,
    passphrase: answers.passphrase,
  }
}

export const createVault = async (
  cmd: Command,
  cfg: VaultConfig,
  path: string,
  setDefault: ?boolean = false,
): Promise<void> => {
  if (cmd.client == null) {
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

  await cmd.client.createVault(path, vault.passphrase)

  // Update config after successful creation by daemon
  cfg.setLabel(path, vault.label)
  if (vault.setDefault) {
    cfg.defaultVault = path
  }
}
