// @flow

import ClientAPIs from '../ClientAPIs'
import type { CommsPublishParams } from '../types'

export default class ContactAPIs extends ClientAPIs {
  publish(params: CommsPublishParams): Promise<void> {
    return this._rpc.request('comms_publish', params)
  }
}
