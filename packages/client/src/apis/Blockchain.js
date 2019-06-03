// @flow
import { Observable } from 'rxjs'

import ClientAPIs from '../ClientAPIs'
import type {
  BlockchainEthSendParams,
  EthUnsubscribeParams,
  SendDeclineTXParams,
  SendWithdrawInviteTXParams,
  SendInviteTXParams,
} from '../types'

export default class BlockchainAPIs extends ClientAPIs {
  ethSend(params: BlockchainEthSendParams): Promise<Object> {
    return this._rpc.request('blockchain_ethSend', params)
  }

  getContractRecipientAddress(params: { userID: string, peerID: string }) {
    return this._rpc.request('blockchain_getContractRecipientAddress', params)
  }

  getContractOriginAddress(params: { userID: string, peerID: string }) {
    return this._rpc.request('blockchain_getContractOriginAddress', params)
  }

  getInviteTXDetails(params: {
    type: 'approve' | 'sendInvite',
    userID: string,
    contactID: string,
  }) {
    return this._rpc.request('blockchain_getInviteTXDetails', params)
  }

  sendInviteTX(params: SendInviteTXParams) {
    return this._rpc.request('blockchain_sendInviteTX', params)
  }

  sendInviteApprovalTX(params: SendInviteTXParams) {
    return this._rpc.request('blockchain_sendInviteApprovalTX', params)
  }

  sendDeclineInviteTX(params: SendDeclineTXParams) {
    return this._rpc.request('blockchain_sendDeclineInviteTX', params)
  }

  sendWithdrawInviteTX(params: SendWithdrawInviteTXParams) {
    return this._rpc.request('blockchain_sendWithdrawInviteTX', params)
  }

  async ethSubscribe(
    params: BlockchainEthSendParams,
  ): Promise<{ subscription: Observable<*>, id: string }> {
    const subID = await this._rpc.request('blockchain_ethSubscribe', params)

    const unsubscribe = () => {
      return this._rpc.request('blockchain_ethUnsubscribe', { id: subID })
    }

    const subscription = Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'eth_subscription' &&
            msg.params != null &&
            msg.params.subscription === subID
          ) {
            observer.next(msg.params)
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
    return {
      subscription,
      id: subID,
    }
  }

  async ethUnsubscribe(params: EthUnsubscribeParams): Promise<Object> {
    return this._rpc.request('blockchain_ethUnsubscribe', params)
  }

  async subscribeNetworkChanged(): Promise<Observable<{ networkID: string }>> {
    const subscription = await this._rpc.request(
      'blockchain_subEthNetworkChanged',
    )
    const unsubscribe = () => {
      return this._rpc.request('sub_unsubscribe', { id: subscription })
    }

    return Observable.create(observer => {
      this._rpc.subscribe({
        next: msg => {
          if (
            msg.method === 'eth_network_subscription' &&
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
  }
}
