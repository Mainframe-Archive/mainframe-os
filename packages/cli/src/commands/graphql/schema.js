// @flow

import fs from 'fs'
import { promisify } from 'util'
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql'

import Command from '../../Command'

const writeFile = promisify(fs.writeFile)

export default class GraphQLSchemaCommand extends Command {
  static description = 'Prints the GraphQL schema'
  static flags = Command.flags
  static args = [
    {
      name: 'path',
      description: 'schema folder path',
      default: './schema.graphql',
    },
  ]

  async run() {
    const client = this.client
    if (client == null) {
      return
    }

    // $FlowFixMe: Flow doesn't seem to properly type the returned data
    const schema = await client.graphql.query({
      query: getIntrospectionQuery(),
    })
    if (schema.data == null) {
      return this.error('Failed to retrieve GraphQL schema')
    }

    const filePath = this.resolvePath(this.args.path)
    await writeFile(
      filePath,
      // $FlowFixMe: Flow doesn't seem to properly type the returned data
      printSchema(buildClientSchema(schema.data)),
    )

    this.log(`Schema written to ${filePath}`)
  }
}
