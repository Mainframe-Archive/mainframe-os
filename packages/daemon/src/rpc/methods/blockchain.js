// @flow

import type {
  BlockchainWeb3SendParams,
  BlockchainWeb3SendResult,
} from '@mainframe/client'
import { type Subscription as RxSubscription, Observable } from 'rxjs'

import { ContextSubscription } from '../../context/ContextSubscriptions'
import type ClientContext from '../../context/ClientContext'
import type { NotifyFunc } from '../../rpc/handleClient'

class EthSubscription extends ContextSubscription<RxSubscription> {
  startNotify(notify: NotifyFunc, observable: Observable<Object>) {
    this.data = observable.subscribe(result =>
      notify(this.method, { subscription: this.id, result }),
    )
  }

  async dispose() {
    if (this.data != null) {
      this.data.unsubscribe()
    }
  }
}

export const web3Send = async (
  ctx: ClientContext,
  params: BlockchainWeb3SendParams,
): Promise<BlockchainWeb3SendResult> => {
  ctx.io.checkEthConnection() // Handle WS connection dropping
  return ctx.io.eth.sendRequest(params)
}

export const web3Subscribe = async (
  ctx: ClientContext,
  payload: BlockchainWeb3SendParams,
): Promise<BlockchainWeb3SendResult> => {
  if (ctx.io.eth.web3Provider.subscribe && ctx.io.eth.web3Provider.on) {
    const method = payload.params[0]
    const subID = await ctx.io.eth.web3Provider.subscribe(
      'eth_subscribe',
      method,
      payload.params,
    )
    ctx.io.eth.web3Provider.on(subID, msg => {
      if (msg.subscription === subID) {
        ctx.notify('eth_subscription', msg)
      }
    })
    return subID
  }
  throw new Error('Subscriptions not supported')
}

export const web3Unsubscribe = async (
  ctx: ClientContext,
  params: BlockchainWeb3SendParams,
): Promise<BlockchainWeb3SendResult> => {
  await ctx.io.eth.web3Provider.unsubscribe(params.id, 'eth_unsubscribe')
}

export const subEthNetworkChanged = {
  handler: async (ctx: ClientContext): Promise<string> => {
    const sub = new EthSubscription('eth_network_subscription')
    ctx.subscriptions.set(sub)
    sub.startNotify(ctx.notify, ctx.events.ethNetworkChanged)
    return sub.id
  },
}
