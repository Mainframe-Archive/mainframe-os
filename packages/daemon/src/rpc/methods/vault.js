// @flow

import {
  decodeBase64,
  type base64, // eslint-disable-line import/named
} from '@mainframe/utils-base64'

import { vaultError } from '../errors'
import type RequestContext from '../RequestContext'

export const create = async (
  ctx: RequestContext,
  [path, password]: [string, string] = [],
) => {
  try {
    await ctx.vaults.create(ctx.socket, path, Buffer.from(password))
  } catch (err) {
    // TODO: different error code depending on actual error
    throw vaultError(err.message)
  }
}

export const open = async (
  ctx: RequestContext,
  [path, password]: [string, string] = [],
) => {
  try {
    await ctx.vaults.open(ctx.socket, path, Buffer.from(password))
  } catch (err) {
    // TODO: different error code depending on actual error
    throw vaultError(err.message)
  }
}
