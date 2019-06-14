// @flow

import { EthClient } from '@mainframe/eth'
import electronRPC from '@mainframe/rpc-electron'
import { Observable } from 'rxjs'

import {
  APP_TRUSTED_CHANNEL,
  RPC_ETHEREUM_ACCOUNTS_CHANGED,
  RPC_ETHEREUM_NETWORK_CHANGED,
} from '../../constants'

const client = electronRPC(APP_TRUSTED_CHANNEL)

const createSubscription = async (
  rpcMethod,
  subMethod,
): Promise<Observable<*>> => {
  const { id } = await client.request(rpcMethod)
  const unsubscribe = () => {
    return client.request('sub_unsubscribe', { id })
  }

  return Observable.create(observer => {
    client.subscribe({
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

const provider = {
  send: async (method: string, params: Array<*>): Promise<*> => {
    return client.request('blockchain_ethSend', { method, params })
  },
}

const subscriptions = {
  accountsChanged: async () => {
    return await createSubscription(
      'ethereum_subscribeAccountsChanged',
      'ethereum_accounts_changed',
    )
  },
  networkChanged: async () => {
    return await createSubscription(
      'ethereum_subscribeNetworkChanged',
      'ethereum_network_changed',
    )
  },
}

export const ethClient = new EthClient(provider, null, subscriptions)

export default {
  // Subscriptions

  createPermissionDeniedSubscription: async () => {
    return await createSubscription(
      'sub_createPermissionDenied',
      'permission_denied',
    )
  },

  // Wallets

  getUserEthWallets: async () => {
    return await client.request('wallet_getUserEthWallets')
  },

  getUserDefaultWallet: async () => {
    const accounts = await client.request('wallet_getEthAccounts')
    return accounts[0]
  },

  selectDefaultWallet: async () => {
    return await client.request('wallet_selectDefault')
  },

  // Contacts

  getUserContacts: async (userID: string) => {
    return await client.request('contacts_getUserContacts', { userID })
  },
}
