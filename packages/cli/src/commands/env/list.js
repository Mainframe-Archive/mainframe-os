// @flow

import { Environment } from '@mainframe/config'
import { Command } from '@oclif/command'
import Table from 'cli-table'

export default class ListCommand extends Command {
  static description = 'Lists the available environments'

  async run() {
    const envs = Environment.list()
    const names = Object.keys(envs)
    if (names.length === 0) {
      this.warn('No environment')
    } else {
      const defaultName = Environment.getDefault()
      const table = new Table({ head: ['Name', 'Type', 'Default'] })
      names.forEach(name => {
        table.push([name, envs[name], name === defaultName ? 'yes' : 'no'])
      })
      console.log(table.toString())
    }
  }
}
