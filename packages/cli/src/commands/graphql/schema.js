// @flow

import fs from 'fs'
import { promisify } from 'util'
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql'

import Command from '../../OpenVaultCommand'

const writeFile = promisify(fs.writeFile)

export default class GraphQLSchemaCommand extends Command {
  static description = 'Prints the GraphQL schema'
  static flags = Command.flags
  static args = [
    {
      name: 'path',
      description: 'schema folder path',
      default: './',
    },
  ]

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    // $FlowFixMe: Flow doesn't seem to properly type the returned data
    const schema = await client.graphql({ query: getIntrospectionQuery() })
    if (schema.data == null) {
      return this.error('Failed to retrieve GraphQL schema')
    }

    const folderPath = this.resolvePath(this.args.path)
    await Promise.all([
      writeFile(`${folderPath}/schema.json`, JSON.stringify(schema, null, 2)),
      writeFile(
        `${folderPath}/schema.graphql`,
        // $FlowFixMe: Flow doesn't seem to properly type the returned data
        printSchema(buildClientSchema(schema.data)),
      ),
    ])

    this.log(`Schema written to ${folderPath}`)
  }
}
