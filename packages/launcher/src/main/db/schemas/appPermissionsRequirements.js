// @flow

// TODO: define updated permissions keys
export type PermissionsDefinitionsData = {
  BLOCKCHAIN_SEND: ?boolean,
  CONTACTS_READ: ?boolean,
  COMMS_CONTACT: ?boolean,
  WEB_REQUEST: ?Array<string>,
}

export type PermissionsRequirementsData = {
  required: ?PermissionsDefinitionsData,
  optional: ?PermissionsDefinitionsData,
}

export type PermissionsDefinitions = $Shape<PermissionsDefinitionsData>
export type PermissionsRequirements = {
  required?: ?PermissionsDefinitions,
  optional?: ?PermissionsDefinitions,
}

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
