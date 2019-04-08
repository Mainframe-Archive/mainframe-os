// @flow

import type {
  ID,
  AppCreateParams,
  AppUserPermissionsSettings,
  GraphQLQueryResult,
} from '@mainframe/client'
import electronRPC from '@mainframe/rpc-electron'
import { Observable } from 'rxjs'

import { LAUNCHER_CHANNEL } from '../../constants'

const rpc = electronRPC(LAUNCHER_CHANNEL)

export default {
  // Apps
  createApp: (appInfo: AppCreateParams) => rpc.request('app_create', appInfo),
  getApps: () => rpc.request('app_getAll'),
  installApp: (
    manifest: Object,
    userID: ID,
    permissionsSettings: AppUserPermissionsSettings,
  ) => {
    return rpc.request('app_install', { manifest, userID, permissionsSettings })
  },
  launchApp: (appID: ID | string, userID: ID | string) => {
    return rpc.request('app_launch', { appID, userID })
  },
  loadManifest: (hash: string) => {
    return rpc.request('app_loadManifest', { hash })
  },
  removeApp: (appID: ID) => rpc.request('app_remove', { appID }),
  removeOwnApp: (appID: ID) => rpc.request('app_removeOwn', { appID }),
  setAppUserPermissionsSettings: (
    appID: string,
    userID: string,
    settings: AppUserPermissionsSettings,
  ) => {
    return rpc.request('app_setUserPermissionsSettings', {
      appID,
      userID,
      settings,
    })
  },

  // Identity
  createUserIdentity: (data: Object) => {
    return rpc.request('identity_createUser', { profile: data })
  },
  createDeveloperIdentity: (data: Object) => {
    return rpc.request('identity_createDeveloper', { profile: data })
  },
  getOwnUserIdentities: () => rpc.request('identity_getOwnUsers'),
  getOwnDevIdentities: () => rpc.request('identity_getOwnDevelopers'),

  // GraphQL
  graphqlQuery: (
    query: string,
    variables?: ?Object,
  ): Promise<GraphQLQueryResult> => {
    return rpc.request('graphql_query', { query, variables })
  },
  graphqlSubscription: (
    query: string,
    variables?: ?Object,
  ): Observable<GraphQLQueryResult> => {
    let subscription
    let unsubscribed = false

    const unsubscribe = () => {
      if (subscription == null) {
        unsubscribed = true
      } else {
        rpc.request('sub_unsubscribe', { id: subscription })
      }
    }

    rpc.request('graphql_subscription', { query, variables }).then(id => {
      if (unsubscribed) {
        return rpc.request('sub_unsubscribe', { id })
      }
      subscription = id
    })

    return Observable.create(observer => {
      rpc.subscribe({
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
              } catch (err) {
                // eslint-disable-next-line no-console
                console.warn('Error handling message', result, err)
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

  // Vault
  getVaultsData: () => rpc.request('vault_getVaultsData'),
  createVault: (password: string, label: string) => {
    return rpc.request('vault_create', { password, label })
  },
  openVault: (path: string, password: string) => {
    return rpc.request('vault_open', { path, password })
  },

  // Wallets & Blockchain
  ethSend: async (params: Object) => {
    return rpc.request('blockchain_ethSend', params)
  },
  getLedgerAccounts: (pageNum: number) => {
    return rpc.request('wallet_getLedgerAccounts', { pageNum })
  },
  ethereumRequest: (params: Object) => {
    return rpc.request('blockchain_ethSend', params)
  },
  getInviteTXDetails: (params: Object) => {
    return rpc.request('blockchain_getInviteTXDetails', params)
  },
  sendInviteApprovalTX: (params: Object) => {
    return rpc.request('blockchain_sendInviteApprovalTX', params)
  },

  sendInviteTX: (params: Object) => {
    return rpc.request('blockchain_sendInviteTX', params)
  },

  sendDeclineInviteTX: (params: { userID: string, peerID: string }) => {
    return rpc.request('blockchain_sendDeclineInviteTX', params)
  },
}
