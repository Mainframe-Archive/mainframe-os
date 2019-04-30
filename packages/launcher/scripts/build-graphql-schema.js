import { writeFileSync } from 'fs'
import { resolve } from 'path'
import {
  buildClientSchema,
  getIntrospectionQuery,
  graphqlSync,
  printSchema,
} from 'graphql'

import schema from '../src/main/graphql/schema'

const output = graphqlSync(schema, getIntrospectionQuery())
const contents = printSchema(buildClientSchema(output.data))
writeFileSync(resolve(__dirname, '..', 'schema.graphql'), contents)
