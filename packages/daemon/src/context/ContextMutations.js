// @flow

import type { OwnUserIdentity } from '../identity'
import ClientContext from './ClientContext'

export type MutationEventType =
  | 'own_user_created'
  | 'vault_created'
  | 'vault_opened'

export default class ContextMutations {
  _context: ClientContext

  constructor(context: ClientContext) {
    this._context = context
  }

  async createVault(path: string, password: string): Promise<void> {
    await this._context.vaults.create(
      this._context.socket,
      path,
      Buffer.from(password),
    )
    this._context.next({ type: 'vault_created' })
  }

  async openVault(path: string, password: string): Promise<void> {
    await this._context.vaults.open(
      this._context.socket,
      path,
      Buffer.from(password),
    )
    this._context.next({ type: 'vault_opened' })
  }

  async createOwnUserIdentity(profile: Object): Promise<OwnUserIdentity> {
    const user = this._context.openVault.identities.createOwnUser(profile)
    await this._context.openVault.save()
    this._context.next({ type: 'own_user_created', user })
    return user
  }
}
