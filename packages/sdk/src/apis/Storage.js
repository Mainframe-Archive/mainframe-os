// @flow

import ClientAPIs from '../ClientAPIs'

export default class StorageAPIs extends ClientAPIs {
  promptDownload(key: string): Promise<boolean> {
    return this._rpc.request('storage_promptDownload', { key })
  }

  promptUpload(key: string): Promise<boolean> {
    return this._rpc.request('storage_promptUpload', { key })
  }

  list(): Promise<Array<?string>> {
    return this._rpc.request('storage_list')
  }

  set(key: string, data: string): Promise<?string> {
    return this._rpc.request('storage_set', { key, data })
  }

  get(key: string): Promise<?string> {
    return this._rpc.request('storage_get', { key })
  }

  delete(key: string): Promise<void> {
    return this._rpc.request('storage_delete', { key })
  }
}
