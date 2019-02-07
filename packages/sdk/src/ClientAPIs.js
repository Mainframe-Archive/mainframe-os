// @flow

import EventEmitter from 'events'
import type StreamRPC from '@mainframe/rpc-stream'

export default class ClientAPIs extends EventEmitter {
  _rpc: StreamRPC

  constructor(rpc: StreamRPC) {
    super()
    this._rpc = rpc
  }
}
