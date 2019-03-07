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
  // TODO: Check ws connection
  return ctx.io.eth.sendRequest(params)
}

export const web3Subscribe = async (
  ctx: ClientContext,
  params: BlockchainWeb3SendParams,
): Promise<BlockchainWeb3SendResult> => {
  if (ctx.io.eth.web3Provider.on) {
    const subID = await ctx.io.eth.sendRequest(params)
    // $FlowFixMe checked 'on' func exists
    ctx.io.eth.web3Provider.on('data', msg => {
      if (msg.params.subscription === subID) {
        ctx.notify(msg.method, msg.params)
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
  const request = ctx.io.eth.createRequest('eth_unsubscribe', [params.id])
  return ctx.io.eth.sendRequest(request)
}

export const subEthNetworkChanged = {
  handler: async (ctx: ClientContext): Promise<string> => {
    const sub = new EthSubscription('eth_network_subscription')
    ctx.subscriptions.set(sub)
    sub.startNotify(ctx.notify, ctx.events.ethNetworkChanged)
    return sub.id
  },
}
