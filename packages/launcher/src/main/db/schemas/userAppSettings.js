// @flow

import { COLLECTION_NAMES } from '../constants'

import permissionsGrants, {
  type PermissionsGrantsData,
} from './appPermissionsGrants'

// These settings should be shared by both own apps and installed ones

export type ApprovedContact = {|
  aliasID: string,
  contact: string,
|}

export type UserAppSettingsData = {|
  localID: string,
  approvedContacts: Array<ApprovedContact>,
  defaultEthAccount: ?string,
  permissionsChecked: boolean,
  permissionsGrants: PermissionsGrantsData,
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
    permissionsGrants,
    // TODO: storage keyPair - also communications one?
  },
}
