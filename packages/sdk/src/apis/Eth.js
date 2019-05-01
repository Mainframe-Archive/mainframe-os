// @flow

import { Observable } from 'rxjs'
import {
  EthClient,
  type SendParams,
  type TXEventEmitter,
  type AbstractProvider,
} from '@mainframe/eth'
import type StreamRPC from '@mainframe/rpc-stream'

import RpcProvider from '../RPCProvider'
import MFWeb3Provider from '../MFWeb3Provider'
import ClientAPIs from '../ClientAPIs'
import type MainrameSDK from '../index'

const MFT_TOKEN_ADDRESSES = {
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
}

type SignParams = {
  address: string,
  data: string,
}

class WalletProvider {
  _rpc: StreamRPC

  constructor(rpc: StreamRPC) {
    this._rpc = rpc
  }

  async getAccounts() {
    return this._rpc.request('wallet_getEthAccounts')
  }

  async signTransaction(params) {
    return this._rpc.request('wallet_signEthTx', params)
  }

  async sign(params: SignParams) {
    return this._rpc.request('wallet_signEthData', params)
  }
}

const subscribe = async (rpc, rpcMethod, subMethod): Promise<Observable<*>> => {
  const subscription = await rpc.request(rpcMethod)
  const unsubscribe = () => {
    return rpc.request('sub_unsubscribe', { id: subscription })
  }

  return Observable.create(observer => {
    rpc.subscribe({
      next: msg => {
        if (
          msg.method === subMethod &&
          msg.params != null &&
          msg.params.subscription === subscription.id
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

export default class EthAPIs extends ClientAPIs {
  _web3Provider: AbstractProvider
  _ethClient: EthClient
  _sdk: MainrameSDK

  constructor(sdk: MainrameSDK) {
    super(sdk._rpc)

    this._sdk = sdk

    const subscriptions = {
      accountsChanged: () =>
        subscribe(
          sdk._rpc,
          'wallet_subEthAccountsChanged',
          'eth_accounts_subscription',
        ),
      networkChanged: () =>
        subscribe(
          sdk._rpc,
          'blockchain_subscribeNetworkChanged',
          'eth_network_subscription',
        ),
    }

    const rpcProvider = new RpcProvider(sdk._rpc)
    const walletProvider = new WalletProvider(sdk._rpc)
    this._ethClient = new EthClient(rpcProvider, walletProvider, subscriptions)

    this._web3Provider = new MFWeb3Provider(this._ethClient)

    rpcProvider.on('data', res => {
      this._web3Provider.emit && this._web3Provider.emit('data', res)
    })

    this._ethClient.on('eth_subscription', value => {
      this.emit('eth_subscription', value)
      this._web3Provider.emit &&
        this._web3Provider.emit('eth_subscription', value)
    })
    this._ethClient.on('accountsChanged', value => {
      this.emit('accountsChanged', value)
      this._web3Provider.emit &&
        this._web3Provider.emit('accountsChanged', value)
    })
    this._ethClient.on('networkChanged', value => {
      this.emit('networkChanged', value)
      this._web3Provider.emit &&
        this._web3Provider.emit('networkChanged', value)
    })
  }

  get web3Provider() {
    return this._web3Provider
  }

  get networkVersion(): ?string {
    return this._ethClient.networkID
  }

  getAccounts(): Promise<Array<string>> {
    return this._ethClient.getAccounts()
  }

  async getDefaultAccount(): Promise<?string> {
    const accounts = await this._ethClient.getAccounts()
    return accounts ? accounts[0] : undefined
  }

  sign(message: string, address: string): Promise<string> {
    return this._ethClient.signMessage(message, address)
  }

  sendETH(params: SendParams): Promise<TXEventEmitter> {
    return this._ethClient.sendETH(params)
  }

  sendMFT(params: SendParams): Promise<TXEventEmitter> {
    if (!this._ethClient._networkName) {
      throw new Error('Unable to establish Ethereum network')
    }
    const tokenAddress = MFT_TOKEN_ADDRESSES[this._ethClient._networkName]
    if (!tokenAddress) {
      throw new Error(
        `MFT contract not available on ${this._ethClient._networkName}`,
      )
    }
    const contract = this._ethClient.erc20Contract(tokenAddress)
    return contract.transfer(params)
  }
}
