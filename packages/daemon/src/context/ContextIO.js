// @flow

import BzzAPI from '@erebos/api-bzz-node'
import PssAPI from '@erebos/api-pss'
import { sign } from '@erebos/secp256k1'
import type StreamRPC from '@mainframe/rpc-stream'
import createWebSocketRPC from '@mainframe/rpc-ws-node'
import { EthClient, ERC20 } from '@mainframe/eth'

import type ClientContext from './ClientContext'

const MFT_TOKEN_ADDRESSES = {
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
}

class WalletProvider {
  _context: ClientContext
  constructor(context: ClientContext) {
    this._context = context
  }
  getAccounts() {
    const id = Object.keys(this._context.openVault.identities.ownUsers)[0]
    return Promise.resolve(this._context.queries.getUserEthAccounts(id))
  }
  signTransaction(params) {
    const netID = this._context.io.eth.networkID
    return this._context.openVault.wallets.signEthTransaction(params, netID)
  }
  sign(params) {
    return Promise.resolve(this._context.openVault.wallets.signEthData(params))
  }
}

export default class ContextIO {
  _context: ClientContext
  _rpc: ?StreamRPC
  _bzz: ?BzzAPI
  _pss: ?PssAPI
  _ethClient: ?EthClient
  _tokenContracts: { [network: string]: ERC20 } = {}

  constructor(context: ClientContext) {
    this._context = context
  }

  get rpc(): StreamRPC {
    if (this._rpc == null) {
      this._rpc = createWebSocketRPC(this._context.openVault.settings.pssURL)
    }
    return this._rpc
  }

  get bzz(): BzzAPI {
    if (this._bzz == null) {
      this._bzz = new BzzAPI({
        url: this._context.openVault.settings.bzzURL,
        signBytes: async (bytes: Array<number>, key: ?Object) => {
          if (key == null) {
            throw new Error('Missing signing key')
          }
          return sign(bytes, key)
        },
      })
    }
    return this._bzz
  }

  get pss(): PssAPI {
    if (this._pss == null) {
      this._pss = new PssAPI(this.rpc)
    }
    return this._pss
  }

  get eth(): EthClient {
    if (this._ethClient == null) {
      this._ethClient = this.initEthClient()
    } else {
      this.checkEthConnection() // Handle WS connection dropping
    }
    // $FlowFixMe null checked above
    return this._ethClient
  }

  get tokenContract() {
    if (this._tokenContracts[this.eth.networkName]) {
      return this._tokenContracts[this.eth.networkName]
    }
    const contract = this.eth.erc20Contract(
      MFT_TOKEN_ADDRESSES[this.eth.networkName],
    )
    this._tokenContracts[this.eth.networkName] = contract
    return contract
  }

  initEthClient() {
    const walletProvider = new WalletProvider(this._context)
    return new EthClient(
      this._context.openVault.settings.ethURL,
      walletProvider,
    )
  }

  checkEthConnection() {
    // Handle WS disconnects
    if (
      this._ethClient &&
      this._ethClient.web3Provider.isConnecting &&
      !this._ethClient.web3Provider.isConnecting() &&
      !this._ethClient.web3Provider.connected
    ) {
      this._ethClient = this.initEthClient()
    }
  }

  clear() {
    this._bzz = undefined
    this._pss = undefined
    this._ethClient = undefined
    if (this._rpc != null) {
      this._rpc.disconnect()
    }
  }
}
