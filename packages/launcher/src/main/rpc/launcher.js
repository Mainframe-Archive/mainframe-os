// @flow

import {
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
  APP_REMOVE_SCHEMA,
  type AppRemoveParams,
  type AppSetUserPermissionsSettingsParams,
  APP_SET_USER_PERMISSIONS_SETTINGS_SCHEMA,
  type BlockchainEthSendParams,
  type GetInviteTXDetailsParams,
  GRAPHQL_QUERY_SCHEMA,
  type GraphQLQueryParams,
  type GraphQLQueryResult,
  DECLINE_INVITE_SCHEMA,
  type IdentityCreateResult,
  type IdentityCreateUserParams,
  type IdentityCreateDeveloperParams,
  type IdentityGetOwnUsersResult,
  type IdentityGetOwnDevelopersResult,
  IDENTITY_CREATE_OWN_USER_SCHEMA,
  IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA,
  INVITE_TX_DETAILS_SCHEMA,
  INVITE_SEND_SCHEMA,
  LOCAL_ID_SCHEMA,
  type SendInviteTXParams,
  type SendDeclineTXParams,
  type SendWithdrawInviteTXParams,
  VAULT_SCHEMA,
  type VaultParams,
  type WalletGetLedgerEthAccountsParams,
  type WalletGetLedgerEthAccountsResult,
  WALLET_GET_LEDGER_ETH_ACCOUNTS_SCHEMA,
  /* eslint-enable import/named */
} from '@mainframe/client'
import type { Subscription as RxSubscription } from 'rxjs'

import { type LauncherContext, ContextSubscription } from '../contexts'

class GraphQLSubscription extends ContextSubscription<RxSubscription> {
  constructor() {
    super('graphql_subscription_update')
  }

  async dispose() {
    if (this.data != null) {
      this.data.unsubscribe()
    }
  }
}

export default {
  // Apps
  app_create: {
    params: APP_CREATE_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: AppCreateParams,
    ): Promise<AppCreateResult> => {
      return ctx.client.app.create(params)
    },
  },
  app_getAll: (ctx: LauncherContext): Promise<AppGetAllResult> => {
    return ctx.client.app.getAll()
  },
  app_install: {
    params: APP_INSTALL_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: AppInstallParams,
    ): Promise<AppInstallResult> => {
      return ctx.client.app.install(params)
    },
  },
  app_launch: {
    params: APP_OPEN_SCHEMA,
    handler: async (ctx: LauncherContext, params: AppOpenParams) => {
      const [appSession, vaultSettings] = await Promise.all([
        ctx.client.app.open(params),
        ctx.client.vault.getSettings(),
      ])
      ctx.launchApp(appSession, vaultSettings)
    },
  },
  app_loadManifest: {
    params: {
      hash: 'string',
    },
    handler: (ctx: LauncherContext, params: { hash: string }) => {
      return ctx.client.app.loadManifest(params)
    },
  },
  app_remove: {
    params: APP_REMOVE_SCHEMA,
    handler: (ctx: LauncherContext, params: AppRemoveParams) => {
      return ctx.client.app.remove(params)
    },
  },
  app_removeOwn: {
    params: APP_REMOVE_SCHEMA,
    handler: (ctx: LauncherContext, params: AppRemoveParams) => {
      return ctx.client.app.remove(params)
    },
  },
  app_setUserPermissionsSettings: {
    params: APP_SET_USER_PERMISSIONS_SETTINGS_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: AppSetUserPermissionsSettingsParams,
    ) => {
      return ctx.client.app.setUserPermissionsSettings(params)
    },
  },

  // Identities
  identity_createUser: {
    params: IDENTITY_CREATE_OWN_USER_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: IdentityCreateUserParams,
    ): Promise<IdentityCreateResult> => {
      return ctx.client.identity.createUser(params)
    },
  },
  identity_createDeveloper: {
    params: IDENTITY_CREATE_OWN_DEVELOPER_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: IdentityCreateDeveloperParams,
    ): Promise<IdentityCreateResult> => {
      return ctx.client.identity.createDeveloper(params)
    },
  },
  identity_getOwnUsers: (
    ctx: LauncherContext,
  ): Promise<IdentityGetOwnUsersResult> => {
    return ctx.client.identity.getOwnUsers()
  },
  identity_getOwnDevelopers: (
    ctx: LauncherContext,
  ): Promise<IdentityGetOwnDevelopersResult> => {
    return ctx.client.identity.getOwnDevelopers()
  },

  // GrahpQL

  graphql_query: {
    params: GRAPHQL_QUERY_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: GraphQLQueryParams,
    ): Promise<GraphQLQueryResult> => {
      return ctx.client.graphql.query(params)
    },
  },
  graphql_subscription: {
    params: GRAPHQL_QUERY_SCHEMA,
    handler: async (
      ctx: LauncherContext,
      params: GraphQLQueryParams,
    ): Promise<string> => {
      const subscription = await ctx.client.graphql.subscription(params)
      const sub = new GraphQLSubscription()
      sub.data = subscription.subscribe(msg => {
        ctx.notify(sub.id, msg)
      })
      ctx.setSubscription(sub)
      return sub.id
    },
  },

  // Subscriptions

  sub_unsubscribe: {
    params: {
      id: LOCAL_ID_SCHEMA,
    },
    handler: (ctx: LauncherContext, params: { id: string }): void => {
      ctx.removeSubscription(params.id)
    },
  },

  // Vaults

  vault_create: {
    handler: async (
      ctx: LauncherContext,
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
  vault_getVaultsData: (ctx: LauncherContext) => ({
    vaults: ctx.vaultConfig.vaults,
    defaultVault: ctx.vaultConfig.defaultVault,
    vaultOpen: ctx.vaultOpen,
  }),
  vault_open: {
    params: VAULT_SCHEMA,
    handler: async (ctx: LauncherContext, params: VaultParams) => {
      await ctx.client.vault.open(params)
      ctx.vaultOpen = params.path
      return { open: true }
    },
  },

  // Wallets & Blockchain

  wallet_getLedgerAccounts: {
    params: WALLET_GET_LEDGER_ETH_ACCOUNTS_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: WalletGetLedgerEthAccountsParams,
    ): Promise<WalletGetLedgerEthAccountsResult> => {
      return ctx.client.wallet.getLedgerEthAccounts(params)
    },
  },

  blockchain_ethSend: async (
    ctx: LauncherContext,
    params: BlockchainEthSendParams,
  ): Promise<Object> => {
    return ctx.client.blockchain.ethSend(params)
  },

  blockchain_getInviteTXDetails: {
    params: INVITE_TX_DETAILS_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: GetInviteTXDetailsParams,
    ): Promise<any> => {
      return ctx.client.blockchain.getInviteTXDetails(params)
    },
  },

  blockchain_sendInviteApprovalTX: {
    params: INVITE_SEND_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: SendInviteTXParams,
    ): Promise<any> => {
      return ctx.client.blockchain.sendInviteApprovalTX(params)
    },
  },

  blockchain_sendInviteTX: {
    params: INVITE_SEND_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: SendInviteTXParams,
    ): Promise<any> => {
      return ctx.client.blockchain.sendInviteTX(params)
    },
  },

  blockchain_sendDeclineInviteTX: {
    params: DECLINE_INVITE_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: SendDeclineTXParams,
    ): Promise<any> => {
      return ctx.client.blockchain.sendDeclineInviteTX(params)
    },
  },

  blockchain_sendWithdrawInviteTX: {
    params: INVITE_SEND_SCHEMA,
    handler: (
      ctx: LauncherContext,
      params: SendWithdrawInviteTXParams,
    ): Promise<any> => {
      return ctx.client.blockchain.sendWithdrawInviteTX(params)
    },
  },
}
