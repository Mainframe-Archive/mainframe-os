// @flow

import type {
  BlockchainEthSendParams,
  BlockchainEthSendResult,
  EthUnsubscribeParams,
  GetInviteTXDetailsParams,
  GetInviteTXDetailsResult,
  SendDeclineTXParams,
  SendInviteTXParams,
  SendWithdrawInviteTXParams,
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

export const ethSend = async (
  ctx: ClientContext,
  params: BlockchainEthSendParams,
): Promise<BlockchainEthSendResult> => {
  return ctx.io.eth.send(params.method, params.params)
}

export const ethSubscribe = async (
  ctx: ClientContext,
  payload: BlockchainEthSendParams,
): Promise<BlockchainEthSendResult> => {
  if (ctx.io.eth.web3Provider.subscribe && ctx.io.eth.web3Provider.on) {
    const method = payload.params[0]
    const subID = await ctx.io.eth.web3Provider.subscribe(
      'eth_subscribe',
      method,
      payload.params,
    )
    // $FlowFixMe type checked
    ctx.io.eth.web3Provider.on(subID, msg => {
      if (msg.subscription === subID) {
        ctx.notify('eth_subscription', msg)
      }
    })
    return subID
  }
  throw new Error('Subscriptions not supported')
}

export const ethUnsubscribe = async (
  ctx: ClientContext,
  params: EthUnsubscribeParams,
): Promise<void> => {
  if (ctx.io.eth.web3Provider.unsubscribe) {
    await ctx.io.eth.unsubscribe(params.id)
  }
}

export const getInviteTXDetails = async (
  ctx: ClientContext,
  params: GetInviteTXDetailsParams,
): Promise<GetInviteTXDetailsResult> => {
  return ctx.invitesHandler.getInviteTXDetails(
    params.type,
    params.userID,
    params.contactID,
  )
}

export const sendInviteApprovalTX = async (
  ctx: ClientContext,
  params: SendInviteTXParams,
): Promise<void> => {
  console.log('blockchain js sendInviteApprovalTX')
  return ctx.invitesHandler.sendInviteApprovalTX(
    params.userID,
    params.contactID,
    params.gasPrice,
    params.fromAddress,
  )
}

export const sendInviteTX = async (
  ctx: ClientContext,
  params: SendInviteTXParams,
): Promise<void> => {
  return ctx.invitesHandler.sendInviteTX(
    params.userID,
    params.contactID,
    params.fromAddress,
  )
}

export const sendDeclineInviteTX = async (
  ctx: ClientContext,
  params: SendDeclineTXParams,
) => {
  return ctx.invitesHandler.declineContactInvite(params.userID, params.peerID)
}

export const sendWithdrawInviteTX = async (
  ctx: ClientContext,
  params: SendWithdrawInviteTXParams,
) => {
  return ctx.invitesHandler.retrieveStake(
    params.userID,
    params.contactID,
    params.recipientAddress,
  )
}

export const subEthNetworkChanged = {
  handler: async (ctx: ClientContext): Promise<string> => {
    const sub = new EthSubscription('eth_network_subscription')
    ctx.subscriptions.set(sub)
    sub.startNotify(ctx.notify, ctx.events.ethNetworkChanged)
    return sub.id
  },
}
