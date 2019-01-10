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
import type ClientContext from '../ClientContext'

export const create = {
  params: VAULT_SCHEMA,
  handler: async (ctx: ClientContext, params: VaultParams) => {
    try {
      await ctx.vaults.create(
        ctx.socket,
        params.path,
        Buffer.from(params.password),
      )
      ctx.createFeeds()
    } catch (err) {
      // TODO: different error code depending on actual error
      throw vaultError(err.message)
    }
  },
}

export const getSettings = (ctx: ClientContext): VaultSettings => {
  return ctx.openVault.settings
}

export const open = {
  params: VAULT_SCHEMA,
  handler: async (ctx: ClientContext, params: VaultParams) => {
    try {
      await ctx.vaults.open(
        ctx.socket,
        params.path,
        Buffer.from(params.password),
      )
      ctx.createFeeds()
    } catch (err) {
      // TODO: different error code depending on actual error
      throw vaultError(err.message)
    }
  },
}

export const setSettings = {
  params: VAULT_SETTINGS_SCHEMA,
  handler: async (
    ctx: ClientContext,
    settings: VaultSettingsParams,
  ): Promise<VaultSettings> => {
    const newSettings = ctx.openVault.setSettings(settings)
    await ctx.openVault.save()
    return newSettings
  },
}
