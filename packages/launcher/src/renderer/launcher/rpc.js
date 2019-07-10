// @flow

import { EthClient } from '@mainframe/eth'
import electronRPC from '@mainframe/rpc-electron'
import type { ExecutionResult } from 'graphql'
import { Observable } from 'rxjs'

import { LAUNCHER_CHANNEL } from '../../constants'
import type { DBOpenResult, UserCreateRequestParams } from '../../types'

const client = electronRPC(LAUNCHER_CHANNEL)

export const ethClient = new EthClient({
  send: async (method: string, params: Array<*>): Promise<*> => {
    return client.request('blockchain_ethSend', { method, params })
  },
})

export default {
  log(levelOrInfo: string | Object, message?: string) {
    const info =
      typeof levelOrInfo === 'string'
        ? { level: levelOrInfo, message }
        : levelOrInfo
    client.notify('log', info)
  },

  async openLauncher(userID?: ?string): Promise<void> {
    await client.request('launcher_open', { userID })
  },

  async openWyre(amount: number): Promise<void> {
    console.log('rpc js')
    console.log(amount)
    await client.request('wyre_open', { amount })
  },

  // DB

  async createDB(password: string, save?: boolean = false): Promise<void> {
    await client.request('db_create', { password, save })
  },
  async openDB(
    password: string,
    save?: boolean = false,
  ): Promise<DBOpenResult> {
    return await client.request('db_open', { password, save })
  },

  // User

  async createUser(params: UserCreateRequestParams): Promise<string> {
    return await client.request('user_create', params)
  },

  // GraphQL

  async graphqlQuery(
    query: string,
    variables?: ?Object,
  ): Promise<ExecutionResult> {
    return await client.request('graphql_query', { query, variables })
  },

  graphqlSubscribe: (
    query: string,
    variables?: ?Object,
  ): Observable<ExecutionResult> => {
    let subscription
    let unsubscribed = false

    const unsubscribe = () => {
      if (subscription == null) {
        unsubscribed = true
      } else {
        client.request('graphql_unsubscribe', { id: subscription })
      }
    }

    client.request('graphql_subscribe', { query, variables }).then(id => {
      if (unsubscribed) {
        return client.request('graphql_unsubscribe', { id })
      }
      subscription = id
    })

    return Observable.create(observer => {
      client.subscribe({
        next: msg => {
          if (
            msg.method === 'graphql_subscription_update' &&
            msg.params != null &&
            msg.params.subscription === subscription
          ) {
            const { result } = msg.params
            if (result != null) {
              try {
                observer.next(result)
              } catch (error) {
                client.notify('log', {
                  level: 'error',
                  message: 'Failed to apply subscription update',
                  error,
                })
              }
            }
          }
        },
        error: err => {
          observer.error(err)
          unsubscribe()
        },
        complete: () => {
          observer.complete()
          unsubscribe()
        },
      })

      return unsubscribe
    })
  },

  // -- old stuff below --

  // // Apps
  // createApp: (appInfo: AppCreateParams) => client.request('app_create', appInfo),
  // getApps: () => client.request('app_getAll'),
  // installApp: (
  //   manifest: Object,
  //   userID: ID,
  //   permissionsSettings: AppUserPermissionsSettings,
  // ) => {
  //   return client.request('app_install', { manifest, userID, permissionsSettings })
  // },
  // launchApp: (appID: ID | string, userID: ID | string) => {
  //   return client.request('app_launch', { appID, userID })
  // },
  // loadManifest: (hash: string) => {
  //   return client.request('app_loadManifest', { hash })
  // },
  // removeApp: (appID: ID) => client.request('app_remove', { appID }),
  // removeOwnApp: (appID: ID) => client.request('app_removeOwn', { appID }),
  // setAppUserPermissionsSettings: (
  //   appID: string,
  //   userID: string,
  //   settings: AppUserPermissionsSettings,
  // ) => {
  //   return client.request('app_setUserPermissionsSettings', {
  //     appID,
  //     userID,
  //     settings,
  //   })
  // },
  //
  // // Identity
  // createUserIdentity: (data: Object) => {
  //   return client.request('identity_createUser', { profile: data })
  // },
  // createDeveloperIdentity: (data: Object) => {
  //   return client.request('identity_createDeveloper', { profile: data })
  // },
  // getOwnUserIdentities: () => client.request('identity_getOwnUsers'),
  // getOwnDevIdentities: () => client.request('identity_getOwnDevelopers'),
  //
  // // GraphQL
  // graphqlQuery: (
  //   query: string,
  //   variables?: ?Object,
  // ): Promise<GraphQLQueryResult> => {
  //   return client.request('graphql_query', { query, variables })
  // },
  // graphqlSubscription: (
  //   query: string,
  //   variables?: ?Object,
  // ): Observable<GraphQLQueryResult> => {
  //   let subscription
  //   let unsubscribed = false
  //
  //   const unsubscribe = () => {
  //     if (subscription == null) {
  //       unsubscribed = true
  //     } else {
  //       client.request('sub_unsubscribe', { id: subscription })
  //     }
  //   }
  //
  //   client.request('graphql_subscription', { query, variables }).then(id => {
  //     if (unsubscribed) {
  //       return client.request('sub_unsubscribe', { id })
  //     }
  //     subscription = id
  //   })
  //
  //   return Observable.create(observer => {
  //     client.subscribe({
  //       next: msg => {
  //         if (
  //           msg.method === 'graphql_subscription_update' &&
  //           msg.params != null &&
  //           msg.params.subscription === subscription
  //         ) {
  //           const { result } = msg.params
  //           if (result != null) {
  //             try {
  //               observer.next(result)
  //             } catch (err) {
  //               // eslint-disable-next-line no-console
  //               console.warn('Error handling message', result, err)
  //             }
  //           }
  //         }
  //       },
  //       error: err => {
  //         observer.error(err)
  //         unsubscribe()
  //       },
  //       complete: () => {
  //         observer.complete()
  //         unsubscribe()
  //       },
  //     })
  //
  //     return unsubscribe
  //   })
  // },
  //
  // // Vault
  // getVaultsData: () => client.request('vault_getVaultsData'),
  // createVault: (password: string, label: string) => {
  //   return client.request('vault_create', { password, label })
  // },
  // openVault: (path: string, password: string) => {
  //   return client.request('vault_open', { path, password })
  // },
  //
  // // Wallets & Blockchain
  ethSend: async (params: Object) => {
    return client.request('blockchain_ethSend', params)
  },
  getLedgerAccounts: (pageNum: number, legacyPath: boolean) => {
    return client.request('wallet_getLedgerAccounts', { pageNum, legacyPath })
  },

  getInviteTXDetails: (params: Object) => {
    return client.request('blockchain_getInviteTXDetails', params)
  },
  sendInviteApprovalTX: (params: Object) => {
    return client.request('blockchain_sendInviteApprovalTX', params)
  },
  sendInviteTX: (params: Object) => {
    return client.request('blockchain_sendInviteTX', params)
  },
  sendDeclineInviteTX: (params: { requestID: string }) => {
    return client.request('blockchain_sendDeclineInviteTX', params)
  },
  sendWithdrawInviteTX: (params: { contactID: string }) => {
    return client.request('blockchain_sendWithdrawInviteTX', params)
  },
}
