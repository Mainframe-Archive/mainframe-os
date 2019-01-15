// @flow

import type { AppCreateParams, VaultParams } from '@mainframe/client'
import { idType as fromClientID } from '@mainframe/utils-id'

import type { OwnApp } from '../app'

import type ClientContext from './ClientContext'

export type MutationEventType =
  | 'own_app_created'
  | 'vault_created'
  | 'vault_opened'

export default class ContextMutations {
  _context: ClientContext

  constructor(context: ClientContext) {
    this._context = context
  }

  // Apps

  async createApp(params: AppCreateParams): Promise<OwnApp> {
    const app = this._context.openVault.createApp({
      contentsPath: params.contentsPath,
      developerID: fromClientID(params.developerID),
      name: params.name,
      version: params.version,
      permissionsRequirements: params.permissionsRequirements,
    })
    await this._context.openVault.save()
    this._context.next({ type: 'own_app_created', app })
    return app
  }

  // Vault

  async createVault(params: VaultParams): Promise<void> {
    await this._context.vaults.create(
      this._context.socket,
      params.path,
      Buffer.from(params.password),
    )
    await this._context.io.eth.setup()
    this._context.next({ type: 'vault_created' })
  }

  async openVault(params: VaultParams): Promise<void> {
    await this._context.vaults.open(
      this._context.socket,
      params.path,
      Buffer.from(params.password),
    )
    await this._context.io.eth.setup()
    this._context.next({ type: 'vault_opened' })
  }
}
