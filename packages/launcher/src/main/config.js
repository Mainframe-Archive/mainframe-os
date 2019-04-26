// @flow

import Conf from 'conf'

const schema = {
  dbCreated: {
    type: 'boolean',
  },
  defaultUser: {
    type: 'string',
  },
  savePassword: {
    type: 'boolean',
  },
}

export type Config = Object

export const createConfig = (projectName: string): Config => {
  const config = new Conf({
    defaults: {
      dbCreated: false,
      savePassword: false,
    },
    encryptionKey: 'mainframe', // NOT a security measure - see https://github.com/sindresorhus/conf#encryptionkey
    projectName,
    schema,
  })

  // Uncomment the following line if needed to re-create the DB
  // config.delete('dbCreated')
  // Uncomment the following line if needed to re-create the default user
  // config.delete('defaultUser')

  return config
}
