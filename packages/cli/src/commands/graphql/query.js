// @flow

import { inspect } from 'util'

import Command from '../../OpenVaultCommand'

export default class GraphQLQueryCommand extends Command {
  static description = 'Run a GraphQL query'
  static flags = Command.flags
  static args = [
    {
      name: 'query',
      description: 'GraphQL query',
      required: true,
    },
  ]

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    const res = await client.graphql.query({ query: this.args.query })
    this.log(inspect(res, { colors: true, depth: null }))
  }
}
