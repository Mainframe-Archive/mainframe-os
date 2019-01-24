// @flow

import type {
  ID,
  AppCreateParams,
  AppUserSettings,
  AppUserPermissionsSettings,
  GraphQLQueryResult,
} from '@mainframe/client'
import electronRPC from '@mainframe/rpc-electron'
import { Observable } from 'rxjs'

import { LAUNCHER_CHANNEL } from '../../constants'

const rpc = electronRPC(LAUNCHER_CHANNEL)

export default {
  // Apps
  getApps: () => rpc.request('app_getAll'),
  installApp: (
    manifest: Object,
    userID: ID,
    permissionsSettings: AppUserPermissionsSettings,
  ) => {
    return rpc.request('app_install', { manifest, userID, permissionsSettings })
  },
  createApp: (appInfo: AppCreateParams) => rpc.request('app_create', appInfo),
  removeApp: (appID: ID) => rpc.request('app_remove', { appID }),
  removeOwnApp: (appID: ID) => rpc.request('app_removeOwn', { appID }),
  launchApp: (appID: ID, userID: ID) => {
    return rpc.request('app_launch', { appID, userID })
  },
  readManifest: (path: string) => rpc.request('app_readManifest', { path }),
  setAppUserSettings: (appID: ID, userID: ID, settings: AppUserSettings) => {
    return rpc.request('app_setUserSettings', { appID, userID, settings })
  },
  setAppUserPermissionsSettings: (
    appID: ID,
    userID: ID,
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
  getLedgerAccounts: (pageNum: number) => {
    return rpc.request('wallet_getLedgerAccounts', { pageNum })
  },
  ethereumRequest: (params: Object) => {
    return rpc.request('blockchain_web3Send', params)
  },
}
