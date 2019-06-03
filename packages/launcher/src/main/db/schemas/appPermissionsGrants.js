// @flow

// TODO: define updated permissions keys
export type PermissionsGrantsData = {
  BLOCKCHAIN_SEND: ?boolean,
  CONTACTS_READ: ?boolean,
  COMMS_CONTACT: ?boolean,
  WEB_REQUEST: ?{
    granted: ?Array<string>,
    denied: ?Array<string>,
  },
}

export type PermissionsGrants = {
  BLOCKCHAIN_SEND?: ?boolean,
  CONTACTS_READ?: ?boolean,
  COMMS_CONTACT?: ?boolean,
  WEB_REQUEST: ?{
    granted?: ?Array<string>,
    denied?: ?Array<string>,
  },
}

export default {
  title: 'app permissions grants',
  version: 0,
  type: 'object',
  properties: {
    BLOCKCHAIN_SEND: {
      type: 'boolean',
    },
    CONTACTS_READ: {
      type: 'boolean',
    },
    COMMS_CONTACT: {
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
