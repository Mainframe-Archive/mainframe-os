// @flow

import { MANIFEST_SCHEMA, SEMVER_SCHEMA } from '@mainframe/app-manifest'
import {
  PERMISSION_KEY_SCHEMA,
  PERMISSION_GRANT_SCHEMA,
  PERMISSIONS_GRANTS_SCHEMA,
  PERMISSIONS_REQUIREMENTS_SCHEMA,
} from '@mainframe/app-permissions'

export { MANIFEST_SCHEMA_MESSAGES } from '@mainframe/app-manifest'

export const OPTIONAL_SEMVER_SCHEMA = { ...SEMVER_SCHEMA, optional: true }

export const LOCAL_ID_SCHEMA = {
  type: 'string',
  length: 21, // nanoid generates 21-chars long strings
}

export const OPTIONAL_LOCAL_ID_SCHEMA = { ...LOCAL_ID_SCHEMA, optional: true }

export const APP_CHECK_PERMISSION_SCHEMA = {
  sessID: LOCAL_ID_SCHEMA,
  key: PERMISSION_KEY_SCHEMA,
  input: { type: 'string', optional: true, empty: false },
}

export const APP_CLOSE_SCHEMA = {
  sessID: LOCAL_ID_SCHEMA,
}

export const APP_CREATE_SCHEMA = {
  contentsPath: 'string',
  developerID: OPTIONAL_LOCAL_ID_SCHEMA,
  name: 'string',
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const APP_GET_MANIFEST_DATA_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const APP_INSTALL_SCHEMA = {
  manifest: MANIFEST_SCHEMA,
  userID: LOCAL_ID_SCHEMA,
  settings: {
    type: 'object',
    props: {
      permissions: PERMISSIONS_GRANTS_SCHEMA,
      permissionsChecked: 'boolean',
    },
  },
}

export const APP_OPEN_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  userID: LOCAL_ID_SCHEMA,
}

export const APP_PUBLISH_CONTENTS_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const APP_REMOVE_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
}

export const APP_SET_PERMISSION_SCHEMA = {
  sessID: LOCAL_ID_SCHEMA,
  key: PERMISSION_KEY_SCHEMA,
  value: PERMISSION_GRANT_SCHEMA,
  persist: { type: 'boolean', optional: true },
}

export const APP_SET_PERMISSIONS_REQUIREMENTS_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  permissions: PERMISSIONS_REQUIREMENTS_SCHEMA,
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const APP_WRITE_MANIFEST_SCHEMA = {
  appID: LOCAL_ID_SCHEMA,
  path: 'string',
  version: OPTIONAL_SEMVER_SCHEMA,
}

export const VAULT_SCHEMA = {
  path: 'string',
  password: 'string',
}
