// @flow

import { APP_FEED_V0 } from '../constants'

import { profileProperty } from './profile'
import {
  ethereumAddressProperty,
  publicKeyProperty,
  signatureProperty,
  swarmHashProperty,
} from './scalars'

export const appManifestProperty = {
  type: 'object',
  required: ['profile', 'version', 'contentsHash', 'webDomains'],
  properties: {
    profile: profileProperty,
    version: {
      type: 'string',
      maxLength: 20,
    },
    contentsHash: swarmHashProperty,
    webDomains: {
      type: 'array',
      items: {
        type: 'object',
        required: ['domain'],
        properties: {
          domain: {
            type: 'string',
            maxLength: 200,
          },
          internal: {
            type: 'boolean',
          },
          external: {
            type: 'boolean',
          },
        },
      },
    },
  },
}

export const appMetadataProperty = {
  type: 'object',
  required: ['authorKey', 'manifest'],
  properties: {
    authorKey: publicKeyProperty,
    manifest: appManifestProperty,
  },
}

export const appFeedSchema = {
  $async: true,
  $id: APP_FEED_V0,
  type: 'object',
  required: ['author', 'content', 'signature'],
  properties: {
    author: ethereumAddressProperty,
    content: appMetadataProperty,
    signature: signatureProperty,
  },
}
