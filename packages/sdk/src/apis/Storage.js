// @flow

import ClientAPIs from '../ClientAPIs'

export default class StorageAPIs extends ClientAPIs {
  requestUpload(params: { name: string }): Promise<?string> {
    return this._rpc.request('storage_requestUpload', params)
  }
}
