// @flow
import HookedProvider from 'web3-provider-engine/subproviders/hooked-wallet.js'
import ProviderEngine from 'web3-provider-engine'
import SubscriptionsProvider from 'web3-provider-engine/subproviders/subscriptions.js'
import { EthClient, type SendParams, type TXEventEmitter } from '@mainframe/eth'
import type StreamRPC from '@mainframe/rpc-stream'

import RPCProvider from '../RPCProvider'
import ClientAPIs from '../ClientAPIs'
import type MainrameSDK from '../index'

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

export default class EthAPIs extends ClientAPIs {
  _web3Provider: ProviderEngine
  _ethClient: EthClient
  _sdk: MainrameSDK

  constructor(sdk: MainrameSDK) {
    super(sdk._rpc)

    this._sdk = sdk

    const engine = new ProviderEngine()
    const hookedWallet = createHookedWallet(this._rpc)
    const rpcProvider = new RPCProvider(this._rpc)
    const subsProvider = new SubscriptionsProvider()
    engine.addProvider(hookedWallet)
    engine.addProvider(subsProvider)
    engine.addProvider(rpcProvider)
    engine.start()
    this._web3Provider = engine
    this._ethClient = new EthClient(engine, true)
    subsProvider.on('data', (err, notif) => {
      engine.emit('data', err, notif)
    })
    this._ethClient.on('accountsChange', value => {
      this.emit('accountsChange', value)
    })
    this._ethClient.on('networkChanged', value => {
      this.emit('networkChanged', value)
    })
  }

  get web3Provider() {
    return this._web3Provider
  }

  get selectedAccount(): ?string {
    return this._ethClient.defaultAccount
  }

  get networkVersion(): ?string {
    return this._ethClient.networkID
  }

  sendETH(params: SendParams): TXEventEmitter {
    return this._ethClient.sendETH(params)
  }

  sendMFT(params: SendParams): TXEventEmitter {
    return this._ethClient.sendMFT(params)
  }

  getAccounts(): Promise<Array<string>> {
    return this._ethClient.getAccounts()
  }
}
