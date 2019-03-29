// @flow

import ClientAPIs from '../ClientAPIs'

export default class StorageAPIs extends ClientAPIs {
  promptUpload(key: string): Promise<?string> {
    return this._rpc.request('storage_promptUpload', { key })
  }

  list(): Promise<Array<?string>> {
    return this._rpc.request('storage_list')
  }

  set(data: string, key: string): Promise<?string> {
    return this._rpc.request('storage_set', { data, key })
  }

  get(key: string): Promise<?string> {
    return this._rpc.request('storage_get', { key })
  }
}
