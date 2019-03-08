// @flow

import ClientAPIs from '../ClientAPIs'

export default class StorageAPIs extends ClientAPIs {
  promptUpload(params: { name: string }): Promise<?string> {
    return this._rpc.request('storage_promptUpload', params)
  }

  list(): Promise<?string> {
    return this._rpc.request('storage_list')
  }

  set(params: { data: string, name: string }): Promise<?string> {
    return this._rpc.request('storage_set', params)
  }

  get(params: { name: string }): Promise<?string> {
    return this._rpc.request('storage_get', params)
  }
}
