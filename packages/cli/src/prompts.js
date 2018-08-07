// @flow

import { prompt } from 'inquirer'

export const promptCreateVault = async (setDefault: ?boolean = false) => {
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

export const promptOpenVault = async () => {
  const answers = await prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Vault password',
    },
  ])

  if (answers.password.length === 0) {
    throw new Error('Please provide a password')
  }

  return answers.password
}
