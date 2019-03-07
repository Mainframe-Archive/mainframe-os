// @flow
import Web3EthAbi from 'web3-eth-abi'

import type EthClient from '../Client'

export default class Contract {
  _ethClient: EthClient
  _abi: Object
  _address: string

  constructor(ethClient: EthClient, abi: Object, address: string) {
    this._ethClient = ethClient
    this._address = address
    this._abi = abi
  }

  get ethClient() {
    return this._ethClient
  }

  get abi() {
    return this._abi
  }

  get address() {
    return this._address
  }

  encodeCall(name: string, params?: Array<any>) {
    const abi = this.abi.find(a => a.name === name)
    return Web3EthAbi.encodeFunctionCall(abi, params || [])
  }
}
