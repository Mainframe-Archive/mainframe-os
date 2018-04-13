// @flow

import { join } from 'path'

import startServer from './rpc/server'

const path = join(process.cwd(), 'mainframed.ipc')

const run = async () => {
  await startServer(path)
  console.log(`server started on ${path}`)
}

run().catch(console.error)
