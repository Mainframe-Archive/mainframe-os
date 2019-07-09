// @flow

import { COLLECTION_NAMES } from '../constants'

import {
  webDomainsDefinitions,
  type WebDomainsDefinitions,
} from './appManifest'

export type ApprovedContact = {|
  aliasID: string,
  contact: string,
|}

export type UserAppSettingsData = {|
  localID: string,
  approvedContacts: Array<ApprovedContact>,
  defaultEthAccount: ?string,
  permissionsChecked: boolean,
  webDomains: WebDomainsDefinitions,
|}

export default {
  title: 'user app settings',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    approvedContacts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          aliasID: {
            type: 'string',
            final: true,
          },
          // TODO: check if possible to populate when nested like this
          contact: {
            type: 'string',
            ref: COLLECTION_NAMES.CONTACTS,
          },
        },
      },
      default: [],
    },
    defaultEthAccount: {
      type: 'string',
    },
    permissionsChecked: {
      type: 'boolean',
      default: false,
    },
    webDomains: {
      ...webDomainsDefinitions,
      default: [],
    },
    // TODO: storage keyPair - also communications one?
  },
}
