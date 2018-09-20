// @flow

import { readManifestFile } from '@mainframe/app-manifest'
import {
  type default as Client,
  /* eslint-disable import/named */
  type AppGetAllResult,
  APP_CREATE_SCHEMA,
  type AppCreateParams,
  type AppCreateResult,
  APP_INSTALL_SCHEMA,
  type AppInstallParams,
  type AppInstallResult,
  APP_OPEN_SCHEMA,
  type AppOpenParams,
  type AppOpenResult,
  APP_REMOVE_SCHEMA,
  type AppRemoveParams,
  APP_REMOVE_OWN_SCHEMA,
  type AppRemoveOwnParams,
  type AppSetUserSettingsParams,
  APP_SET_USER_SETTINGS_SCHEMA,
  type IdentityCreateResult,
  type IdentityGetOwnUsersResult,
  type IdentityGetOwnDevelopersResult,
  VAULT_SCHEMA,
  type VaultParams,
  /* eslint-enable import/named */
} from '@mainframe/client'
import type { VaultConfig } from '@mainframe/config'

export const TRUSTED_CHANNEL = 'rpc-trusted'

export type LaunchAppFunc = (data: AppOpenResult) => Promise<void>

export type TrustedContext = {
  client: Client,
  launchApp: LaunchAppFunc,
  vaultConfig: VaultConfig,
  vaultOpen?: ?string,
}

export const trustedMethods = {
  createUserIdentity: {
    params: {
      data: 'any',
    },
    handler: (
      ctx: TrustedContext,
      params: { data?: Object },
    ): Promise<IdentityCreateResult> => {
      return ctx.client.identity.createUser(params)
    },
  },
  createDeveloperIdentity: {
    params: {
      data: 'any',
    },
    handler: (
      ctx: TrustedContext,
      params: { data?: Object },
    ): Promise<IdentityCreateResult> => {
      return ctx.client.identity.createDeveloper(params)
    },
  },
  createVault: {
    handler: async (
      ctx: TrustedContext,
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
  getApps: (ctx: TrustedContext): Promise<AppGetAllResult> => {
    return ctx.client.app.getAll()
  },
  getOwnUserIdentities: (
    ctx: TrustedContext,
  ): Promise<IdentityGetOwnUsersResult> => {
    return ctx.client.identity.getOwnUsers()
  },
  getOwnDevIdentities: (
    ctx: TrustedContext,
  ): Promise<IdentityGetOwnDevelopersResult> => {
    return ctx.client.identity.getOwnDevelopers()
  },
  getVaultsData: (ctx: TrustedContext) => ({
    vaults: ctx.vaultConfig.vaults,
    defaultVault: ctx.vaultConfig.defaultVault,
    vaultOpen: ctx.vaultOpen,
  }),
  createApp: {
    params: APP_CREATE_SCHEMA,
    handler: (
      ctx: TrustedContext,
      params: AppCreateParams,
    ): Promise<AppCreateResult> => {
      return ctx.client.app.create(params)
    },
  },
  installApp: {
    params: APP_INSTALL_SCHEMA,
    handler: (
      ctx: TrustedContext,
      params: AppInstallParams,
    ): Promise<AppInstallResult> => {
      return ctx.client.app.install(params)
    },
  },
  launchApp: {
    params: APP_OPEN_SCHEMA,
    handler: async (ctx: TrustedContext, params: AppOpenParams) => {
      const appSession = await ctx.client.app.open(params)
      ctx.launchApp(appSession)
    },
  },
  openVault: {
    params: VAULT_SCHEMA,
    handler: async (ctx: TrustedContext, params: VaultParams) => {
      await ctx.client.vault.open(params)
      ctx.vaultOpen = params.path
      return { open: true }
    },
  },
  readManifest: {
    params: {
      path: 'string',
    },
    handler: async (ctx: TrustedContext, params: { path: string }) => {
      const manifest = await readManifestFile(params.path)
      return {
        data: manifest.data,
        // TODO: lookup keys to check if they match know identities in vault
        keys: manifest.keys,
      }
    },
  },
  removeApp: {
    params: APP_REMOVE_SCHEMA,
    handler: (ctx: TrustedContext, params: AppRemoveParams) => {
      return ctx.client.app.remove(params)
    },
  },
  removeOwnApp: {
    params: APP_REMOVE_OWN_SCHEMA,
    handler: (ctx: TrustedContext, params: AppRemoveOwnParams) => {
      return ctx.client.app.removeOwn(params)
    },
  },
  setAppUserSettings: {
    params: APP_SET_USER_SETTINGS_SCHEMA,
    handler: (ctx: TrustedContext, params: AppSetUserSettingsParams) => {
      return ctx.client.app.setUserSettings(params)
    },
  },
}
