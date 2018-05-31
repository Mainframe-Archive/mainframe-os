// @flow

import {
  decodeBase64,
  type base64, // eslint-disable-line import/named
} from '@mainframe/utils-base64'

import { vaultError } from '../errors'
import type RequestContext from '../RequestContext'

export const create = async (
  ctx: RequestContext,
  [path, key]: [string, base64] = [],
) => {
  try {
    await ctx.vaults.create(ctx.socket, path, decodeBase64(key))
    return 'OK'
  } catch (err) {
    // TODO: different error code depending on actual error
    throw vaultError(err.message)
  }
}

export const open = async (
  ctx: RequestContext,
  [path, key]: [string, base64] = [],
) => {
  try {
    await ctx.vaults.open(ctx.socket, path, decodeBase64(key))
    return 'OK'
  } catch (err) {
    // TODO: different error code depending on actual error
    throw vaultError(err.message)
  }
}
