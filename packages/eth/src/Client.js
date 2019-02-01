// @flow
import EventEmitter from 'events'
import web3Utils from 'web3-utils'
import Web3EthAbi from 'web3-eth-abi'

import RequestManager from './RequestManager'
import ABI from './abi'
import type { SendParams, TXEventEmitter } from './types'

export const TOKEN_ADDRESS = {
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
}

const MFT_TOKEN_ADDRESSES = {
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
}

export default class EthClient extends RequestManager {
  // Reading blockchain data

  // async startCheckingAccounts() {
  //   const accounts = await this.getAccounts
  //   const accountInterval = setInterval(function() {
  //     if (web3.eth.accounts[0] !== account) {
  //       account = web3.eth.accounts[0]
  //       updateInterface()
  //     }
  //   }, 100)
  // }

  async getAccounts(): Promise<Array<string>> {
    const accountsReq = this.createRequest('eth_accounts', [])
    return this.sendRequest(accountsReq)
  }

  async getTokenBalance(
    tokenAddress: string,
    accountAddress: string,
  ): Promise<Object> {
    const abi = ABI.ERC20.find(a => a.name === 'balanceOf')
    const data = Web3EthAbi.encodeFunctionCall(abi, [accountAddress])
    const mftBalanceReq = this.createRequest('eth_call', [
      { data, to: tokenAddress },
      'latest',
    ])
    const res = await this.sendRequest(mftBalanceReq)
    return web3Utils.fromWei(res, 'ether')
  }

  async getMFTBalance(accountAddress: string): Promise<Object> {
    const tokenAddress = TOKEN_ADDRESS[this.network]
    if (!tokenAddress) {
      throw new Error(`Unsupported Ethereum network: ${this.network}`)
    }
    return this.getTokenBalance(tokenAddress, accountAddress)
  }

  async getETHBalance(address: string) {
    const ethBalanceReq = this.createRequest('eth_getBalance', [
      address,
      'latest',
    ])
    const res = await this.sendRequest(ethBalanceReq)
    return web3Utils.fromWei(res, 'ether')
  }

  // async getTokenDecimals(tokenAddr: string) {
  //   const abi = ABI.ERC20.find(a => a.name === 'decimals')
  //   const data = Web3EthAbi.encodeFunctionCall(abi)
  //   const req = this.createRequest('eth_call', [{ data, to: tokenAddr }])
  //   const res = await this.sendRequest(req)
  //   return web3Utils.hexToNumber(res)
  // }

  // Sending transactions

  sendETH(params: SendParams) {
    const valueWei = web3Utils.toWei(String(params.value))
    const valueHex = web3Utils.toHex(valueWei)
    const reqParams = {
      to: params.to,
      from: params.from,
      value: valueHex,
    }
    const request = {
      method: 'eth_sendTransaction',
      params: [reqParams],
    }
    return this.sendTX(request, params.confirmations)
  }

  sendMFT(params: SendParams) {
    const valueWei = web3Utils.toWei(String(params.value))
    const abi = ABI.ERC20.find(a => a.name === 'transfer')
    const data = Web3EthAbi.encodeFunctionCall(abi, [params.to, valueWei])
    const to = MFT_TOKEN_ADDRESSES[this.network]
    const reqParams = { from: params.from, to, data }
    const request = {
      method: 'eth_sendTransaction',
      params: [reqParams],
    }
    return this.sendTX(request, params.confirmations)
  }

  async getConfirmations(txHash: string): Promise<?number> {
    const request = this.createRequest('eth_getTransactionReceipt', [txHash])
    const res = await this.sendRequest(request)
    if (!res) {
      return null
    }
    const blockRequest = this.createRequest('eth_blockNumber', [])
    const blockRes = await this.sendRequest(blockRequest)
    const txBlock = web3Utils.hexToNumber(res.blockNumber)
    const latestBlock = web3Utils.hexToNumber(blockRes)
    return latestBlock - txBlock
  }

  async confirmTransaction(
    txHash: string,
    requestID: number,
    confirmationsRequired: ?number = 10,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._intervals[requestID] = setInterval(async () => {
        try {
          // $FlowFixMe comparison type
          const confirmations = await this.getConfirmations(txHash)
          if (
            confirmations !== null &&
            confirmations >= confirmationsRequired
          ) {
            clearInterval(this._intervals[requestID])
            this._intervals[requestID] = undefined
            resolve(true)
          }
        } catch (err) {
          reject(err)
        }
      }, 1500)
    })
  }

  sendTX(requestData: Object, confirmations: ?number = 10): TXEventEmitter {
    const eventEmitter = new EventEmitter()
    const req = this.createRequest(requestData.method, requestData.params)
    this.sendRequest(req)
      .then(res => {
        eventEmitter.emit('hash', res)
        return this.confirmTransaction(res, req.id, 0).then(() => {
          eventEmitter.emit('mined', res)
          return this.confirmTransaction(res, req.id, confirmations)
        })
      })
      .then(res => {
        eventEmitter.emit('confirmed', res)
      })
      .catch(err => {
        eventEmitter.emit('error', err)
      })
    return eventEmitter
  }
}
