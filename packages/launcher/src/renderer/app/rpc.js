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
    return client.request('ethereum_send', { method, params })
  },
}

const subscriptions = {
  accountsChanged: async () => {
    return await createSubscription(
      'ethereum_subscribeAccountsChanged',
      RPC_ETHEREUM_ACCOUNTS_CHANGED,
    )
  },
  networkChanged: async () => {
    return await createSubscription(
      'ethereum_subscribeNetworkChanged',
      RPC_ETHEREUM_NETWORK_CHANGED,
    )
  },
}

let ethClient

export const getEthClient = () => {
  if (ethClient == null) {
    ethClient = new EthClient(provider, null, subscriptions)
  }
  return ethClient
}

export default {
  // Subscriptions

  createPermissionDeniedSubscription: async () => {
    return await createSubscription(
      'sub_createPermissionDenied',
      'permission_denied',
    )
  },

  // Ethereum

  getEthAccounts: async () => {
    return await client.request('ethereum_getAccounts')
  },

  // Wallets

  getUserWallets: async () => {},

  selectDefaultWallet: async () => {
    return await client.request('wallet_selectDefault')
  },

  // Contacts

  getApprovedContacts: async (connectedOnly?: boolean = false) => {
    const res = await client.request('contacts_getApproved')
    return connectedOnly
      ? {
          contacts: res.contacts.map(
            c => c.contact.connectionState === 'connected',
          ),
        }
      : res
  },
}
