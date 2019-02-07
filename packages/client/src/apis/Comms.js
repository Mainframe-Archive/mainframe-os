// @flow

import ClientAPIs from '../ClientAPIs'
import type {
  CommsGetSubscribableParams,
  CommsGetSubscribableResult,
  CommsPublishParams,
} from '../types'

export default class ContactAPIs extends ClientAPIs {
  publish(params: CommsPublishParams): Promise<void> {
    return this._rpc.request('comms_publish', params)
  }

  getSubscribable(
    params: CommsGetSubscribableParams,
  ): Promise<CommsGetSubscribableResult> {
    return this._rpc.request('comms_getSubscribable', params)
  }
}
