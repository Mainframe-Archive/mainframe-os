// Not a proper test setup - run "node -r esm __tests__/app-flow" to check behavior

import path from 'path'

import {
  createPackage,
  createChecksum,
  encodeManifest,
  decodeManifest,
} from '../lib/app/packager'
import AppIdentity from '../lib/identity/AppIdentity'
import AuthorIdentity from '../lib/identity/AuthorIdentity'

const srcPath = path.resolve(__dirname, '..', '__fixtures__', 'package')
const destPath = path.resolve(__dirname, '..', '__fixtures__', 'pack.asar')

const manifest = {
  name: 'My first app',
  version: '0.1.0',
}

const app = AppIdentity.create()
const author = AuthorIdentity.create()

const run = async () => {
  await createPackage(srcPath, destPath)
  const checksum = await createChecksum(destPath)
  manifest.checksum = checksum.toString('base64')

  const encoded = encodeManifest(
    manifest,
    app.getPairSign(),
    author.getPairSign(),
  )
  const decoded = decodeManifest(encoded)

  const validChecksum = decoded.checksum === manifest.checksum
  console.log('valid?', decoded, validChecksum)
}

run().catch(console.error)
