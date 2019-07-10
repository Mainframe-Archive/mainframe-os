// @flow

import bzzHash from './bzzHash'
import profile, { type GenericProfileData } from './genericProfile'

export type WebDomainDefinition = {|
  domain: string,
  internal?: ?boolean, // Call from sandbox
  external?: ?boolean, // Open in external browser
|}
export type WebDomainsDefinitions = Array<WebDomainDefinition>

export const webDomainsDefinitions = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
      },
      internal: {
        type: 'boolean',
      },
      external: {
        type: 'boolean',
      },
    },
  },
}

export type AppManifestData = {|
  profile: GenericProfileData,
  version: string,
  contentsHash: string,
  webDomains: WebDomainsDefinitions,
|}

export default {
  title: 'application manifest',
  version: 0,
  type: 'object',
  required: ['profile', 'contentsHash', 'webDomains'],
  properties: {
    profile,
    version: {
      type: 'string', // semver
      final: true,
    },
    contentsHash: bzzHash,
    webDomains: webDomainsDefinitions,
  },
}
