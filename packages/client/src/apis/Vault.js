// @flow

import ClientAPIs from '../ClientAPIs'
import type { VaultParams } from '../types'

export default class VaultAPIs extends ClientAPIs {
  create(params: VaultParams): Promise<void> {
    return this._rpc.request('vault_create', params)
  }

  open(params: VaultParams): Promise<void> {
    return this._rpc.request('vault_open', params)
  }
}
