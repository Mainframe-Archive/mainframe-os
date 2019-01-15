// @flow

// eslint-disable-next-line import/named
import {
  VAULT_SCHEMA,
  VAULT_SETTINGS_SCHEMA,
  type VaultParams,
  type VaultSettings,
  type VaultSettingsParams,
} from '@mainframe/client'

import { vaultError } from '../errors'
import type RequestContext from '../RequestContext'

export const create = {
  params: VAULT_SCHEMA,
  handler: async (ctx: RequestContext, params: VaultParams) => {
    try {
      await ctx.vaults.create(
        ctx.socket,
        params.path,
        Buffer.from(params.password),
      )
    } catch (err) {
      // TODO: different error code depending on actual error
      throw vaultError(err.message)
    }
  },
}

export const getSettings = (ctx: RequestContext): VaultSettings => {
  return ctx.openVault.settings
}

export const open = {
  params: VAULT_SCHEMA,
  handler: async (ctx: RequestContext, params: VaultParams) => {
    try {
      await ctx.vaults.open(
        ctx.socket,
        params.path,
        Buffer.from(params.password),
      )
      ctx.eth.setup()
    } catch (err) {
      // TODO: different error code depending on actual error
      throw vaultError(err.message)
    }
  },
}

export const setSettings = {
  params: VAULT_SETTINGS_SCHEMA,
  handler: async (
    ctx: RequestContext,
    settings: VaultSettingsParams,
  ): Promise<VaultSettings> => {
    const newSettings = ctx.openVault.setSettings(settings)
    await ctx.openVault.save()
    return newSettings
  },
}
