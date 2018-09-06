// @flow

import type { ID } from '@mainframe/client'
import electronRPC from '@mainframe/rpc-electron'
import { Observable } from 'rxjs'

import { TRUSTED_CHANNEL } from '../constants'

const rpc = electronRPC(TRUSTED_CHANNEL)

export default {
  // Apps
  getInstalledApps: () => rpc.request('app_getInstalled'),
  installApp: (manifest: Object, userID: ID, settings: Object) => {
    return rpc.request('app_install', { manifest, userID, settings })
  },
  removeApp: (appID: ID) => rpc.request('app_remove', { appID }),
  launchApp: (appID: ID, userID: ID) => {
    return rpc.request('app_launch', { appID, userID })
  },
  readManifest: (path: string) => rpc.request('app_readManifest', { path }),

  // Identity
  createUserIdentity: (data: Object) => {
    return rpc.request('identity_createUser', { data })
  },
  getOwnUserIdentities: () => rpc.request('identity_getOwnUsers'),

  // Subscriptions
  createPermissionDeniedSubscription: async (): Promise<Observable<Object>> => {
    const { id } = await rpc.request('sub_createPermissionDenied')
    const unsubscribe = () => {
      return rpc.request('sub_unsubscribe', { id })
    }

    return Observable.create(observer => {
      rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'permission_denied' &&
            msg.params != null &&
            msg.params.subscription === id
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

  // Main process
  getVaultsData: () => rpc.request('vault_getVaultsData'),
  createVault: (password: string, label: string) => {
    return rpc.request('vault_create', { password, label })
  },
  openVault: (path: string, password: string) => {
    return rpc.request('vault_open', { path, password })
  },
}
