// @flow

import { flags } from '@oclif/command'
import getPort from 'get-port'
import micro, { json } from 'micro'

import Command from '../../OpenVaultCommand'

export default class GraphQLServerCommand extends Command {
  static description = 'Run a GraphQL server'
  static flags = {
    ...Command.flags,
    port: flags.string({
      char: 'p',
      description: 'server port',
      default: '8000',
    }),
  }

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    const port = await getPort({ port: parseInt(this.flags.port, 10) })
    const server = micro(async req => {
      return await client.graphql.query(await json(req))
    })

    server.listen(port, () => {
      this.log(`GraphQL server listening on http://localhost:${port}`)
    })

    await new Promise(resolve => {
      process.on('SIGINT', () => {
        server.close(resolve)
      })
    })
  }
}
