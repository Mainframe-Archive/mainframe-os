// @flow

import type { Observable, Subscription } from 'rxjs'
import { debounceTime, filter } from 'rxjs/operators'

import { OwnFeed } from '../swarm/feed'

import type ClientContext from './ClientContext'
import type {
  ContextEvent,
  ContactCreatedEvent,
  ContactLoadedEvent,
  UserCreatedEvent,
  UserChangedEvent,
} from './types'

export default class ContextEvents {
  vaultOpened: Observable<ContextEvent>
  vaultModified: Observable<ContextEvent>

  _context: ClientContext
  _subscriptions: { [key: string]: Subscription } = {}

  constructor(context: ClientContext) {
    this._context = context

    this.vaultOpened = this._context.pipe(
      filter((e: ContextEvent) => {
        return e.type === 'vault_created' || e.type === 'vault_opened'
      }),
    )
    this.vaultModified = this._context.pipe(
      filter((e: ContextEvent) => {
        return (
          e.type === 'user_created' ||
          e.type === 'user_changed' ||
          e.type === 'user_deleted' ||
          e.type === 'peer_created' ||
          e.type === 'peer_changed' ||
          e.type === 'peer_deleted' ||
          e.type === 'contact_created' ||
          e.type === 'contact_changed' ||
          e.type === 'contact_deleted'
        )
      }),
    )

    // Using addSubscription() will make sure the subscription will be cleared when the client disconnects
    this.addSubscription(
      'autoSaveVault',
      this.vaultModified.pipe(debounceTime(1000)).subscribe(async () => {
        try {
          await this._context.openVault.save()
        } catch (e) {
          this._context.log('Failed to save vault: ', e)
        }
      }),
    )
    this.addSubscription(
      'userFeedStale',
      this._context
        .pipe(
          filter((e: ContextEvent) => {
            return (
              e.type === 'user_created' ||
              (e.type === 'user_changed' && e.change === 'profile')
            )
          }),
        )
        .subscribe(async (e: UserCreatedEvent | UserChangedEvent) => {
          const { user } = e
          await user.publicFeed.publishJSON(
            this._context.io.bzz,
            user.publicFeedData(),
          )
          const saveRequired = await user.publicFeed.syncManifest(
            this._context.io.bzz,
          )
          if (saveRequired) {
            this._context.next({
              type: 'user_changed',
              user,
              change: 'publicFeed',
            })
          }
        }),
    )
    this.addSubscription(
      'contactRequestPending',
      this._context
        .pipe(
          filter((e: ContextEvent) => {
            return (
              (e.type === 'contact_created' || e.type === 'contact_loaded') &&
              e.contact.connectionState === 'sending'
            )
          }),
        )
        .subscribe(async (e: ContactCreatedEvent | ContactLoadedEvent) => {
          const { contact, userID } = e
          const user = this._context.openVault.identities.getOwnUser(userID)
          const peer = this._context.openVault.identities.getPeerUser(
            contact.peerID,
          )
          if (!user || !peer) return

          // TODO: Actual data
          await contact.ownFeed.publishJSON(this._context.io.bzz, {
            message: 'connected',
          })
          await contact.ownFeed.syncManifest(this._context.io.bzz)

          // Create ephemeral one-use feed from the first-contact keypair and peer-specific topic
          const firstContactFeed = OwnFeed.create(
            user.firstContactFeed.keyPair,
            peer.base64PublicKey(),
          )
          await firstContactFeed.publishJSON(
            this._context.io.bzz,
            contact.firstContactData(),
          )
          contact.requestSent = true

          this._context.next({
            type: 'contact_changed',
            contact,
            userID,
            change: 'requestSent',
          })

          // // Check if other user created feed
          // try {
          //   const topic = getFeedTopic({ name: user.base64PublicKey() })
          //   const peerFeedRes = await this._context.io.bzz.getFeedValue(
          //     peer.firstContactAddress,
          //     { topic },
          //     { mode: 'content-response' },
          //   )
          //   const data = await peerFeedRes.json()
          //   contact.contactFeed = data.privateFeed
          //   await this._context.openVault.save()
          // } catch (_e) {
          //   // Should always be due to contact feed not being ready
          //   // TODO: Rethrow other errors
          // }
        }),
    )
  }

  addSubscription(key: string, subscription: Subscription) {
    this._subscriptions[key] = subscription
  }

  removeSubscription(key: string) {
    const sub = this._subscriptions[key]
    if (sub != null) {
      sub.unsubscribe()
    }
  }

  clear() {
    Object.values(this._subscriptions).forEach(sub => {
      // $FlowFixMe: Object.values() losing type
      sub.unsubscribe()
    })
    this._subscriptions = {}
  }
}
