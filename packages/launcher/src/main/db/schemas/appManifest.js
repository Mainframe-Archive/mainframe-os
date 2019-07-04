// @flow

import permissionsRequirements, {
  type PermissionsRequirementsData,
} from './appPermissionsRequirements'
import bzzHash from './bzzHash'
import ethAddress from './ethAddress'
import profile, { type GenericProfileData } from './genericProfile'

export type AppManifestData = {|
  authorAddress: string,
  profile: GenericProfileData,
  version: string,
  contentsHash: string,
  permissions: PermissionsRequirementsData,
|}

export default {
  title: 'application manifest',
  version: 0,
  type: 'object',
  properties: {
    authorAddress: {
      ...ethAddress,
      final: true,
    },
    profile,
    version: {
      type: 'string', // semver
      final: true,
    },
    contentsHash: bzzHash,
    permissions: permissionsRequirements,
  },
  required: ['profile', 'version', 'contentsHash', 'permissions'],
}
