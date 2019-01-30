// @flow
import HookedProvider from 'web3-provider-engine/subproviders/hooked-wallet.js'
import ProviderEngine from 'web3-provider-engine'
import SubscriptionsProvider from 'web3-provider-engine/subproviders/subscriptions.js'
import { EthClient, type SendParams, type TXObservable } from '@mainframe/eth'
import type StreamRPC from '@mainframe/rpc-stream'

import RPCProvider from '../RPCProvider'
import ClientAPIs from '../ClientAPIs'
import type MainrameSDK from '../index'

type PayContactParams = {
  contactID?: string,
  currency: 'ETH' | 'MFT',
  value: number,
  from?: ?string,
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

  async payContact(params: PayContactParams): Promise<TXObservable> {
    const { contactID, currency, value } = params
    let contact
    if (!contactID) {
      contact = await this._sdk.contacts.selectContact()
    } else {
      contact = await this._sdk.contacts.getDataForContact(contactID)
    }
    if (!contact) {
      throw new Error('No contact selected')
    }
    if (!contact.data || !contact.data.profile.ethAddress) {
      throw new Error(`No eth address found for contact: ${contactID}`)
    }
    // TODO: Fetch 'from' address from trusted UI if none provided
    const accounts = await this.getAccounts()
    if (!accounts || !accounts.length) {
      throw new Error(`No wallets found`)
    }
    const sendParams = {
      from: accounts[0],
      to: contact.data.profile.ethAddress,
      value,
    }
    switch (currency) {
      case 'MFT':
        return this.sendMFT(sendParams)
      case 'ETH':
        return this.sendETH(sendParams)
      default:
        throw new Error(`Unsupported currency type: ${currency}`)
    }
  }

  sendETH(params: SendParams): TXObservable {
    return this._ethClient.sendETH(params)
  }

  sendMFT(params: SendParams): TXObservable {
    return this._ethClient.sendMFT(params)
  }

  getAccounts(): Promise<Array<string>> {
    return this._ethClient.getAccounts()
  }
}
