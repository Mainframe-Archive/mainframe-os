// @flow
import HookedProvider from 'web3-provider-engine/subproviders/hooked-wallet.js'
import ProviderEngine from 'web3-provider-engine'
import SubscriptionsProvider from 'web3-provider-engine/subproviders/subscriptions.js'
import { EthClient } from '@mainframe/eth'
import type StreamRPC from '@mainframe/rpc-stream'

import RPCProvider from '../RPCProvider'
import ClientAPIs from '../ClientAPIs'

export type SendParams = {
  to?: string,
  from: string,
  recipent: string,
  value: number,
  confirmations?: number,
}

const createHookedWallet = (rpc: StreamRPC) => {
  return new HookedProvider({
    getAccounts: async cb => {
      try {
        const accounts = await rpc.request('wallet_getEthAccounts')
        cb(null, accounts)
      } catch (err) {
        cb(err)
      }
    },
    signTransaction: async (params, cb) => {
      const txParams = {
        chain: 'ethereum',
        transactionData: params,
      }
      try {
        const res = await rpc.request('wallet_signTx', txParams)
        cb(null, res)
      } catch (err) {
        cb(err)
      }
    },
  })
}

export default class BlockchainAPIs extends ClientAPIs {
  _web3Provider: ProviderEngine
  _ethClient: EthClient

  constructor(rpc: StreamRPC) {
    super(rpc)

    const engine = new ProviderEngine()
    const hookedWallet = createHookedWallet(this._rpc)
    const rpcProvider = new RPCProvider(this._rpc)
    const subsProvider = new SubscriptionsProvider()
    engine.addProvider(hookedWallet)
    engine.addProvider(subsProvider)
    engine.addProvider(rpcProvider)
    subsProvider.on('data', (err, notif) => {
      engine.emit('data', err, notif)
    })
    engine.start()
    this._web3Provider = engine
    this._ethClient = new EthClient(engine)
  }

  get web3Provider() {
    return this._web3Provider
  }

  sendETH(params: SendParams) {
    return this._ethClient.sendETH(params)
  }

  sendMFT(params: SendParams) {
    return this._ethClient.sendMFT(params)
  }
}
