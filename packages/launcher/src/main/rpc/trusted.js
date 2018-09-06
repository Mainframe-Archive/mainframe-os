// @flow

import { readManifestFile } from '@mainframe/app-manifest'
import {
  /* eslint-disable import/named */
  type AppGetInstalledResult,
  APP_INSTALL_SCHEMA,
  type AppInstallParams,
  type AppInstallResult,
  APP_OPEN_SCHEMA,
  type AppOpenParams,
  APP_REMOVE_SCHEMA,
  type AppRemoveParams,
  type IdentityCreateResult,
  type IdentityGetOwnUsersResult,
  LOCAL_ID_SCHEMA,
  VAULT_SCHEMA,
  type VaultParams,
  /* eslint-enable import/named */
} from '@mainframe/client'

import type AppContext from '../AppContext'

export default {
  // Apps
  app_getInstalled: (ctx: AppContext): Promise<AppGetInstalledResult> => {
    return ctx.client.app.getInstalled()
  },
  app_install: {
    params: APP_INSTALL_SCHEMA,
    handler: (
      ctx: AppContext,
      params: AppInstallParams,
    ): Promise<AppInstallResult> => {
      return ctx.client.app.install(params)
    },
  },
  app_launch: {
    params: APP_OPEN_SCHEMA,
    handler: async (ctx: AppContext, params: AppOpenParams) => {
      const appSession = await ctx.client.app.open(params)
      ctx.launchApp(appSession)
    },
  },
  app_readManifest: {
    params: {
      path: 'string',
    },
    handler: async (ctx: AppContext, params: { path: string }) => {
      const manifest = await readManifestFile(params.path)
      return {
        data: manifest.data,
        // TODO: lookup keys to check if they match know identities in vault
        keys: manifest.keys,
      }
    },
  },
  app_remove: {
    params: APP_REMOVE_SCHEMA,
    handler: (ctx: AppContext, params: AppRemoveParams) => {
      return ctx.client.app.remove(params)
    },
  },

  // Identities
  identity_createUser: {
    params: {
      data: 'any',
    },
    handler: (
      ctx: AppContext,
      params: { data?: Object },
    ): Promise<IdentityCreateResult> => {
      return ctx.client.identity.createUser(params)
    },
  },
  identity_getOwnUsers: (
    ctx: AppContext,
  ): Promise<IdentityGetOwnUsersResult> => {
    return ctx.client.identity.getOwnUsers()
  },

  // Subscriptions
  sub_createPermissionDenied: (ctx: AppContext): { id: string } => ({
    id: ctx.createPermissionDeniedSubscription(),
  }),
  sub_unsubscribe: {
    params: {
      id: LOCAL_ID_SCHEMA,
    },
    handler: (ctx: AppContext, params: { id: string }): void => {
      ctx.removeSubscription(params.id)
    },
  },

  // Vaults
  vault_create: {
    handler: async (
      ctx: AppContext,
      params: { label: string, password: string },
    ): Promise<string> => {
      const path = ctx.vaultConfig.createVaultPath()
      await ctx.client.vault.create({ path, password: params.password })
      ctx.vaultConfig.setLabel(path, params.label)
      ctx.vaultConfig.defaultVault = path
      ctx.vaultOpen = path
      return path
    },
  },
  vault_getVaultsData: (ctx: AppContext) => ({
    vaults: ctx.vaultConfig.vaults,
    defaultVault: ctx.vaultConfig.defaultVault,
    vaultOpen: ctx.vaultOpen,
  }),
  vault_open: {
    params: VAULT_SCHEMA,
    handler: async (ctx: AppContext, params: VaultParams) => {
      await ctx.client.vault.open(params)
      ctx.vaultOpen = params.path
      return { open: true }
    },
  },
}
