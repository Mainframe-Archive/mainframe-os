// @flow

import { join } from 'path'
import { MFID } from '@mainframe/data-types'

import type Environment from './Environment'

export const getAppContentsPath = (
  env: Environment,
  appID: string,
  version: string,
): string => {
  const safeID = MFID.from(appID).toEncodedString('base64url')
  return join(env.paths.data, 'apps', safeID, version)
}
