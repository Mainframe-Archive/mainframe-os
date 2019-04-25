// @flow

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
