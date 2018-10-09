// @flow

import ClientAPIs from '../ClientAPIs'
import type { BlockchainWeb3SendParams } from '../types'

export default class BlockchainAPIs extends ClientAPIs {
  web3Send(params: BlockchainWeb3SendParams): Promise<Object> {
    return this._rpc.request('blockchain_web3Send', params)
  }
}
