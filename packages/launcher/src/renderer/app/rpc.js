// @flow

import electronRPC from '@mainframe/rpc-electron'
import { Observable } from 'rxjs'

import { APP_TRUSTED_CHANNEL } from '../../constants'

const rpc = electronRPC(APP_TRUSTED_CHANNEL)

const createSubscription = async (rpcMethod, subMethod) => {
  const { id } = await rpc.request(rpcMethod)
  const unsubscribe = () => {
    return rpc.request('sub_unsubscribe', { id })
  }

  return Observable.create(observer => {
    rpc.subscribe({
      next: msg => {
        if (
          msg.method === subMethod &&
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
}

export default {
  // Subscriptions

  createPermissionDeniedSubscription: async () =>
    createSubscription('sub_createPermissionDenied', 'permission_denied'),

  ethNetworkChangedSubscription: async () =>
    createSubscription(
      'blockchain_subscribeNetworkChanged',
      'eth_network_subscription',
    ),

  ethAccountsChangedSubscription: async () =>
    createSubscription(
      'wallet_subEthAccountsChanged',
      'eth_accounts_subscription',
    ),

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
