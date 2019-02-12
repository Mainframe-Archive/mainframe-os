// @flow

import type {
  BlockchainWeb3SendParams,
  BlockchainWeb3SendResult,
} from '@mainframe/client'
import type { Subscription as RxSubscription, Observable } from 'rxjs'

import type ClientContext from '../../context/ClientContext'
import { ContextSubscription } from '../../context/ContextSubscriptions'

export const web3Send = async (
  ctx: ClientContext,
  params: BlockchainWeb3SendParams,
): Promise<BlockchainWeb3SendResult> => {
  return ctx.io.eth.sendRequest(params)
}

export class EthSubscription extends ContextSubscription<RxSubscription> {
  constructor() {
    super('eth_network_subscription')
  }

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

export const subEthNetworkChanged = {
  handler: async (ctx: ClientContext): Promise<string> => {
    const sub = new EthSubscription()
    ctx.subscriptions.set(sub)
    sub.startNotify(ctx.notify, ctx.events.ethNetworkChanged)
    return sub.id
  },
}
