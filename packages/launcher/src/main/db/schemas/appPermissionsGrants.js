// @flow

export type PermissionsGrantsData = {|
  CONTACT_COMMUNICATION: ?boolean,
  CONTACT_LIST: ?boolean,
  ETHEREUM_TRANSACTION: ?boolean,
  WEB_REQUEST: ?{
    granted: ?Array<string>,
    denied: ?Array<string>,
  },
|}

export type PermissionsGrants = $Shape<PermissionsGrantsData>

export type StrictPermissionsGrants = {|
  CONTACT_COMMUNICATION: boolean,
  CONTACT_LIST: boolean,
  ETHEREUM_TRANSACTION: boolean,
  WEB_REQUEST: {
    granted: Array<string>,
    denied: Array<string>,
  },
|}

export default {
  title: 'app permissions grants',
  version: 0,
  type: 'object',
  properties: {
    CONTACT_COMMUNICATION: {
      type: 'boolean',
    },
    CONTACT_LIST: {
      type: 'boolean',
    },
    ETHEREUM_TRANSACTION: {
      type: 'boolean',
    },
    WEB_REQUEST: {
      type: 'object',
      properties: {
        granted: {
          type: 'array',
          items: {
            type: 'string', // URL
          },
        },
        denied: {
          type: 'array',
          items: {
            type: 'string', // URL
          },
        },
      },
    },
  },
}
