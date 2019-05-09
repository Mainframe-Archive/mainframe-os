// @flow

import type { ExecutionResult } from 'graphql'

import type {
  DBRequestParams,
  DBOpenResult,
  GraphQLRequestParams,
  UserCreateRequestParams,
} from '../../types'
import { getAccountsByPage } from '../wallets/ledgerClient'

import type { LauncherContext } from '../context/launcher'

const DB_PARAMS = {
  password: 'string',
  save: {
    type: 'boolean',
    optional: true,
  },
}

const GRAPHQL_PARAMS = {
  query: 'string',
  variables: {
    type: 'object',
    optional: true,
  },
}

export default {
  // DB

  db_create: {
    params: DB_PARAMS,
    async handler(ctx: LauncherContext, params: DBRequestParams) {
      try {
        await ctx.system.openDB(params.password)
        if (params.save) {
          await ctx.system.savePassword(params.password)
        }
      } catch (error) {
        const message = 'Failed to create DB'
        ctx.logger.log({ level: 'error', message, error })
        throw new Error(message)
      }
    },
  },

  db_open: {
    params: DB_PARAMS,
    async handler(
      ctx: LauncherContext,
      params: DBRequestParams,
    ): Promise<DBOpenResult> {
      try {
        await ctx.system.openDB(params.password)
        if (params.save) {
          await ctx.system.savePassword(params.password)
        }

        const user = await ctx.getUserChecked()
        return user == null
          ? { user: false, wallet: false }
          : { user: true, wallet: user.hasEthWallet() }
      } catch (error) {
        const message = 'Failed to open DB'
        ctx.logger.log({ level: 'error', message, error })
        throw new Error(message)
      }
    },
  },

  // User onboarding

  user_create: {
    params: {
      profile: {
        type: 'object',
        props: {
          name: 'string',
        },
      },
      isPrivate: 'boolean',
    },
    async handler(
      ctx: LauncherContext,
      params: UserCreateRequestParams,
    ): Promise<string> {
      ctx.logger.log({ level: 'debug', message: 'Create user request', params })
      try {
        if (ctx.db == null) {
          throw new Error('Cannot create user before database is opened')
        }

        const user = await ctx.db.users.create({
          profile: params.profile,
          privateProfile: params.isPrivate,
        })
        ctx.logger.log({
          level: 'debug',
          message: 'Created user',
          id: user.localID,
        })

        if (ctx.userID == null) {
          ctx.userID = user.localID
          ctx.logger.log({
            level: 'debug',
            message: 'Created user set as context user',
            id: user.localID,
          })
        }

        if (ctx.system.defaultUser == null) {
          ctx.system.defaultUser = user.localID
          ctx.logger.log({
            level: 'debug',
            message: 'Created user set as system default',
            id: user.localID,
          })
        }

        return user.localID
      } catch (error) {
        ctx.logger.log({
          level: 'error',
          message: 'User creation failed',
          error: error.toString(),
          params,
        })
        throw new Error('Failed to create user')
      }
    },
  },

  // GrahpQL

  graphql_query: {
    params: GRAPHQL_PARAMS,
    async handler(
      ctx: LauncherContext,
      params: GraphQLRequestParams,
    ): Promise<ExecutionResult> {
      ctx.logger.log({
        level: 'debug',
        message: 'GraphQL query',
        params,
      })
      try {
        const result = await ctx.query(params.query, params.variables)
        ctx.logger.log({
          level: 'debug',
          message: 'GraphQL query result',
          params,
          result,
        })
        return result
      } catch (error) {
        ctx.logger.log({
          level: 'error',
          message: 'GraphQL query failed',
          error: error.toString(),
          params,
        })
        throw new Error('GraphQL query failed')
      }
    },
  },

  graphql_subscribe: {
    params: GRAPHQL_PARAMS,
    async handler(
      ctx: LauncherContext,
      params: GraphQLRequestParams,
    ): Promise<string> {
      return await ctx.subscribe(params.query, params.variables)
    },
  },

  graphql_unsubscribe: {
    params: { id: 'string' },
    async handler(ctx: LauncherContext, params: { id: string }): Promise<void> {
      await ctx.unsubscribe(params.id)
    },
  },

  // // Apps
  // app_create: {
  //   params: APP_CREATE_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: AppCreateParams,
  //   ): Promise<AppCreateResult> => {
  //     return ctx.client.app.create(params)
  //   },
  // },
  // app_getAll: (ctx: LauncherContext): Promise<AppGetAllResult> => {
  //   return ctx.client.app.getAll()
  // },
  // app_install: {
  //   params: APP_INSTALL_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: AppInstallParams,
  //   ): Promise<AppInstallResult> => {
  //     return ctx.client.app.install(params)
  //   },
  // },
  // app_launch: {
  //   params: APP_OPEN_SCHEMA,
  //   handler: async (ctx: LauncherContext, params: AppOpenParams) => {
  //     const [appSession, vaultSettings] = await Promise.all([
  //       ctx.client.app.open(params),
  //       ctx.client.vault.getSettings(),
  //     ])
  //     ctx.launchApp(appSession, vaultSettings)
  //   },
  // },
  // app_loadManifest: {
  //   params: {
  //     hash: 'string',
  //   },
  //   handler: (ctx: LauncherContext, params: { hash: string }) => {
  //     return ctx.client.app.loadManifest(params)
  //   },
  // },
  // app_remove: {
  //   params: APP_REMOVE_SCHEMA,
  //   handler: (ctx: LauncherContext, params: AppRemoveParams) => {
  //     return ctx.client.app.remove(params)
  //   },
  // },
  // app_removeOwn: {
  //   params: APP_REMOVE_SCHEMA,
  //   handler: (ctx: LauncherContext, params: AppRemoveParams) => {
  //     return ctx.client.app.remove(params)
  //   },
  // },
  // app_setUserPermissionsSettings: {
  //   params: APP_SET_USER_PERMISSIONS_SETTINGS_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: AppSetUserPermissionsSettingsParams,
  //   ) => {
  //     return ctx.client.app.setUserPermissionsSettings(params)
  //   },
  // },
  //
  // // Identities
  // identity_createUser: {
  //   params: IDENTITY_CREATE_OWN_USER_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: IdentityCreateUserParams,
  //   ): Promise<IdentityCreateResult> => {
  //     return ctx.client.identity.createUser(params)
  //   },
  // },
  // identity_createDeveloper: {
  //   params: IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: IdentityCreateDeveloperParams,
  //   ): Promise<IdentityCreateResult> => {
  //     return ctx.client.identity.createDeveloper(params)
  //   },
  // },
  // identity_getOwnUsers: (
  //   ctx: LauncherContext,
  // ): Promise<IdentityGetOwnUsersResult> => {
  //   return ctx.client.identity.getOwnUsers()
  // },
  // identity_getOwnDevelopers: (
  //   ctx: LauncherContext,
  // ): Promise<IdentityGetOwnDevelopersResult> => {
  //   return ctx.client.identity.getOwnDevelopers()
  // },
  //
  // // GrahpQL
  //
  // graphql_query: {
  //   params: GRAPHQL_QUERY_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: GraphQLQueryParams,
  //   ): Promise<GraphQLQueryResult> => {
  //     return ctx.client.graphql.query(params)
  //   },
  // },
  // graphql_subscription: {
  //   params: GRAPHQL_QUERY_SCHEMA,
  //   handler: async (
  //     ctx: LauncherContext,
  //     params: GraphQLQueryParams,
  //   ): Promise<string> => {
  //     const subscription = await ctx.client.graphql.subscription(params)
  //     const sub = new GraphQLSubscription()
  //     sub.data = subscription.subscribe(msg => {
  //       ctx.notify(sub.id, msg)
  //     })
  //     ctx.setSubscription(sub)
  //     return sub.id
  //   },
  // },
  //
  // // Subscriptions
  //
  // sub_unsubscribe: {
  //   params: {
  //     id: LOCAL_ID_SCHEMA,
  //   },
  //   handler: (ctx: LauncherContext, params: { id: string }): void => {
  //     ctx.removeSubscription(params.id)
  //   },
  // },
  //
  // // Vaults
  //
  // vault_create: {
  //   handler: async (
  //     ctx: LauncherContext,
  //     params: { label: string, password: string },
  //   ): Promise<string> => {
  //     const path = ctx.vaultConfig.createVaultPath()
  //     await ctx.client.vault.create({ path, password: params.password })
  //     ctx.vaultConfig.setLabel(path, params.label)
  //     ctx.vaultConfig.defaultVault = path
  //     ctx.vaultOpen = path
  //     return path
  //   },
  // },
  // vault_getVaultsData: (ctx: LauncherContext) => ({
  //   vaults: ctx.vaultConfig.vaults,
  //   defaultVault: ctx.vaultConfig.defaultVault,
  //   vaultOpen: ctx.vaultOpen,
  // }),
  // vault_open: {
  //   params: VAULT_SCHEMA,
  //   handler: async (ctx: LauncherContext, params: VaultParams) => {
  //     await ctx.client.vault.open(params)
  //     ctx.vaultOpen = params.path
  //     return { open: true }
  //   },
  // },
  //
  // // Wallets & Blockchain
  //
  wallet_getLedgerAccounts: (
    ctx: LauncherContext,
    params: WalletGetLedgerEthAccountsParams,
  ): Promise<WalletGetLedgerEthAccountsResult> => {
    try {
      return getAccountsByPage(params)
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'Failed to get ledger accounts',
        err,
      })
      throw err
    }
  },
  //
  // blockchain_ethSend: async (
  //   ctx: LauncherContext,
  //   params: BlockchainEthSendParams,
  // ): Promise<Object> => {
  //   return ctx.client.blockchain.ethSend(params)
  // },
  //
  // blockchain_getInviteTXDetails: {
  //   params: INVITE_TX_DETAILS_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: GetInviteTXDetailsParams,
  //   ): Promise<any> => {
  //     return ctx.client.blockchain.getInviteTXDetails(params)
  //   },
  // },
  //
  // blockchain_sendInviteApprovalTX: {
  //   params: INVITE_SEND_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: SendInviteTXParams,
  //   ): Promise<any> => {
  //     return ctx.client.blockchain.sendInviteApprovalTX(params)
  //   },
  // },
  //
  // blockchain_sendInviteTX: {
  //   params: INVITE_SEND_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: SendInviteTXParams,
  //   ): Promise<any> => {
  //     return ctx.client.blockchain.sendInviteTX(params)
  //   },
  // },
  //
  // blockchain_sendDeclineInviteTX: {
  //   params: DECLINE_INVITE_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: SendDeclineTXParams,
  //   ): Promise<any> => {
  //     return ctx.client.blockchain.sendDeclineInviteTX(params)
  //   },
  // },
  //
  // blockchain_sendWithdrawInviteTX: {
  //   params: INVITE_SEND_SCHEMA,
  //   handler: (
  //     ctx: LauncherContext,
  //     params: SendWithdrawInviteTXParams,
  //   ): Promise<any> => {
  //     return ctx.client.blockchain.sendWithdrawInviteTX(params)
  //   },
  // },
}
