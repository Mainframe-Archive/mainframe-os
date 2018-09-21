// @flow

import ClientAPIs from '../ClientAPIs'
import type { VaultParams, VaultSettings, VaultSettingsParams } from '../types'

export default class VaultAPIs extends ClientAPIs {
  create(params: VaultParams): Promise<void> {
    return this._rpc.request('vault_create', params)
  }

  getSettings(): Promise<VaultSettings> {
    return this._rpc.request('vault_getSettings')
  }

  open(params: VaultParams): Promise<void> {
    return this._rpc.request('vault_open', params)
  }

  setSettings(params: VaultSettingsParams): Promise<VaultSettings> {
    return this._rpc.request('vault_setSettings', params)
  }
}
