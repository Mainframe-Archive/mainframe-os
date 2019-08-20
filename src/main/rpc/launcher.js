// @flow

import type { ExecutionResult } from 'graphql'

import type {
  ContactGetInviteTXDetailsParams,
  DBRequestParams,
  DBOpenResult,
  GraphQLRequestParams,
  UserCreateRequestParams,
  WalletGetLedgerEthAccountsParams,
} from '../../types'
import { getAccountsByPage } from '../wallets/ledgerClient'

import type { LauncherContext } from '../context/launcher'

type BlockchainEthSendParams = {
  method: string,
  params: any,
}

type SendInviteTXParams = {
  contactID: string,
  customAddress: string,
}

type SendDeclineTXParams = {
  requestID: string,
}

type SendWithdrawInviteTXParams = {
  contactID: string,
}

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
        ctx.logger.log({ level: 'error', message, error: error.toString() })
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
        ctx.logger.log({ level: 'error', message, error: error.toString() })
        throw new Error(message)
      }
    },
  },

  // Windows management

  window_openApp: {
    params: {
      userAppVersionID: {
        type: 'string',
      },
    },
    async handler(
      ctx: LauncherContext,
      params: { userAppVersionID: string },
    ): Promise<void> {
      const { userAppVersionID } = params
      ctx.logger.log({ level: 'debug', message: 'Open app', userAppVersionID })
      await ctx.system.openAppVersion(userAppVersionID)
    },
  },

  window_openOwnApp: {
    params: {
      userOwnAppID: {
        type: 'string',
      },
    },
    async handler(
      ctx: LauncherContext,
      params: { userOwnAppID: string },
    ): Promise<void> {
      const { userOwnAppID } = params
      ctx.logger.log({ level: 'debug', message: 'Open own app', userOwnAppID })
      await ctx.system.openOwnApp(userOwnAppID)
    },
  },

  window_openLauncher: {
    params: {
      userID: {
        type: 'string',
        optional: true,
      },
    },
    async handler(
      ctx: LauncherContext,
      params: { userID?: ?string },
    ): Promise<void> {
      ctx.system.openLauncher(params.userID)
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
          // eslint-disable-next-line require-atomic-updates
          ctx.userID = user.localID
          ctx.logger.log({
            level: 'debug',
            message: 'Created user set as context user',
            id: user.localID,
          })
        }

        if (ctx.system.defaultUser == null) {
          // eslint-disable-next-line require-atomic-updates
          ctx.system.defaultUser = user.localID
          ctx.logger.log({
            level: 'debug',
            message: 'Created user set as system default',
            id: user.localID,
          })

          if (!ctx.system.syncing) {
            await ctx.system.startSync()
          }
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

  // GraphQL

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
      ctx.logger.log({
        level: 'debug',
        message: 'GraphQL subscription',
        params,
      })
      try {
        const result = await ctx.subscribe(params.query, params.variables)
        ctx.logger.log({
          level: 'debug',
          message: 'GraphQL subscription result',
          params,
          result,
        })
        return result
      } catch (error) {
        ctx.logger.log({
          level: 'error',
          message: 'GraphQL subscription failed',
          error: error.toString(),
          params,
        })
        throw new Error('GraphQL subscription failed')
      }
    },
  },

  graphql_unsubscribe: {
    params: { id: 'string' },
    async handler(ctx: LauncherContext, params: { id: string }): Promise<void> {
      await ctx.unsubscribe(params.id)
    },
  },

  // Wallets & Blockchain

  wallet_getLedgerAccounts: async (
    ctx: LauncherContext,
    params: WalletGetLedgerEthAccountsParams,
  ): Promise<Array<string>> => {
    try {
      return await getAccountsByPage(params.pageNum, params.legacyPath)
    } catch (err) {
      ctx.logger.log({
        level: 'error',
        message: 'Failed to get ledger accounts',
        err,
      })
      throw err
    }
  },

  blockchain_ethSend: async (
    ctx: LauncherContext,
    params: BlockchainEthSendParams,
  ): Promise<Object> => {
    const user = await ctx.getUserChecked()
    if (user == null) {
      throw new Error('No user')
    }
    return await user.getEth().send(params.method, params.params)
  },

  blockchain_getInviteTXDetails: async (
    ctx: LauncherContext,
    params: ContactGetInviteTXDetailsParams,
  ): Promise<any> => {
    const invitesSync = await ctx.getInvitesSync()
    return invitesSync.getInviteTXDetails(params.type, params.contactID)
  },

  blockchain_sendInviteApprovalTX: async (
    ctx: LauncherContext,
    params: SendInviteTXParams,
  ): Promise<any> => {
    const invitesSync = await ctx.getInvitesSync()
    return invitesSync.sendInviteApprovalTX(
      params.contactID,
      params.customAddress,
    )
  },

  blockchain_sendInviteTX: async (
    ctx: LauncherContext,
    params: SendInviteTXParams,
  ): Promise<any> => {
    const invitesSync = await ctx.getInvitesSync()
    return invitesSync.sendInviteTX(params.contactID, params.customAddress)
  },

  blockchain_sendDeclineInviteTX: async (
    ctx: LauncherContext,
    params: SendDeclineTXParams,
  ): Promise<any> => {
    const invitesSync = await ctx.getInvitesSync()
    return invitesSync.declineContactInvite(params.requestID)
  },

  blockchain_sendWithdrawInviteTX: async (
    ctx: LauncherContext,
    params: SendWithdrawInviteTXParams,
  ): Promise<any> => {
    const invitesSync = await ctx.getInvitesSync()
    return invitesSync.retrieveStake(params.contactID)
  },
}
