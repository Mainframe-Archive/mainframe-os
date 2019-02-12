// @flow

import electronRPC from '@mainframe/rpc-electron'
import { Observable } from 'rxjs'

import { APP_TRUSTED_CHANNEL } from '../../constants'

const rpc = electronRPC(APP_TRUSTED_CHANNEL)

export default {
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

  ethNetworkChangedSubscription: async (): Promise<Observable<Object>> => {
    const { id } = await rpc.request('blockchain_subscribeNetworkChanged')
    const unsubscribe = () => {
      return rpc.request('sub_unsubscribe', { id })
    }

    return Observable.create(observer => {
      rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'eth_network_subscription' &&
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

  // Wallets

  getUserEthWallets: async () => {
    return rpc.request('wallet_getUserEthWallets')
  },

  getUserDefaultWallet: async () => {
    const accounts = await rpc.request('wallet_getEthAccounts')
    return accounts[0]
  },

  selectDefaultWallet: async () => {
    return rpc.request('wallet_selectDefault')
  },

  web3Send: async (params: Object) => {
    return rpc.request('blockchain_web3Send', params)
  },

  // Contacts

  getUserContacts: async (userID: string) => {
    return rpc.request('contacts_getUserContacts', { userID })
  },
}
