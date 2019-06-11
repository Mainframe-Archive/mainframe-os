// @flow

export type PermissionsDefinitionsData = {
  CONTACT_COMMUNICATION: ?boolean,
  CONTACT_LIST: ?boolean,
  ETHEREUM_TRANSACTION: ?boolean,
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
