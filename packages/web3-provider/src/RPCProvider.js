//@flow
import type StreamRPC from '@mainframe/rpc-stream'
import Subprovider from 'web3-provider-engine/subproviders/subprovider'

type Callback = (?Error, ?any) => any

export default class RPCProvider extends Subprovider {
  _rpc: StreamRPC
  constructor(rpc: StreamRPC) {
    super()
    this._rpc = rpc
  }
  handleRequest = async (payload: Object, next: Callback, end: Callback) => {
    try {
      const res = await this._rpc.request('blockchain_web3Send', payload)
      end(null, res)
    } catch (err) {
      end(err)
    }
  }
}
