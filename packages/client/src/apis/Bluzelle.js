//@flow

import ClientAPIs from '../ClientAPIs'
import type {
  BluzelleWriteParams,
  BluzelleReadParams,
} from '../types'

export default class BluzelleAPIs extends ClientAPIs {
  write(params: BluzelleWriteParams) {
    return this._rpc.request('bluzelle_write', params)
  }

  read(params: BluzelleReadParams) {
    return this._rpc.request('bluzelle_read', params)
  }
}
