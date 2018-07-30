// @flow

import { join } from 'path'

import type Environment from './Environment'

export const getAppContentsPath = (
  env: Environment,
  appID: string,
  version: string,
): string => {
  return join(env.paths.data, 'apps', appID, version)
}
