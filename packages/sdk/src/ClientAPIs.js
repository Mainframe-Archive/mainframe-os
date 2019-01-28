// @flow

import type StreamRPC from '@mainframe/rpc-stream'

export default class ClientAPIs {
  _rpc: StreamRPC

  constructor(rpc: StreamRPC) {
    this._rpc = rpc
  }
}
