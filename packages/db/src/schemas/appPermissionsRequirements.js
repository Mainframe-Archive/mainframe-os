// @flow

const permissionsDefinitions = {
  title: 'web requests permissions grants',
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
      type: 'array',
      items: {
        type: 'string', // URL
      },
    },
  },
}

export default {
  title: 'app permissions requirements',
  version: 0,
  type: 'object',
  properties: {
    required: permissionsDefinitions,
    optional: permissionsDefinitions,
  },
}
