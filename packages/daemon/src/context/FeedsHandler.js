// @flow

import { type Observable, Subject, type Subscription } from 'rxjs'
import { filter, multicast, refCount, tap } from 'rxjs/operators'

import type Contact from '../identity/Contact'
import type {
  default as PeerUserIdentity,
  PublicFeedSerialized,
} from '../identity/PeerUserIdentity'
import { pollFeedJSON } from '../swarm/feed'

import type ClientContext from './ClientContext'
import type {
  ContextEvent,
  ContactChangedEvent,
  PeerDeletedEvent,
} from './types'

type ObserveFeed<T = Object> = {
  dispose: () => void,
  source: Observable<T>,
}

const MINUTE = 60 * 1000

class FeedsHandler {
  _context: ClientContext
  _observers: Set<Observable<any>> = new Set()
  _subscriptions: { [localID: string]: Subscription } = {}

  constructor(context: ClientContext) {
    this._context = context
  }

  remove(localID: string) {
    const sub = this._subscriptions[localID]
    if (sub != null) {
      sub.unsubscribe()
    }
  }

  clear() {
    // $FlowFixMe: Object.values() losing type
    Object.values(this._subscriptions).forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this._observers = new Set()
    this._subscriptions = {}
  }
}

/*
  There is a possible one-to-many relationship between a peer and contacts if
  the user has mutilple identities.
  The ContactsFeedsHandler handles this by multicasting and reference counting
  over a single observable for a given peer and adding one subscription per
  contact (cf https://rxjs.dev/guide/subject#reference-counting).
  It also keeps track of the observers (client subscriptions) in order to stop
  subscribing when there is no observer left.
  This logic would cause the peer feed polling to happen only if there is at
  least one contact linked to this peer, and the client subscribing to contacts
  changes. For every peer change, a single `peer_changed` event is emitted, and
  one `contact_changed` event for each contact linked to the peer.
*/

type PeerFeed = {
  source: Subject<PublicFeedSerialized>,
  refCounted: Observable<PublicFeedSerialized>,
}

export class ContactsFeedsHandler extends FeedsHandler {
  _peerFeeds: { [localID: string]: PeerFeed } = {}
  _peerDeletedSubscription: ?Subscription

  _getPeerFeed(peer: PeerUserIdentity): Observable<PublicFeedSerialized> {
    const existing = this._peerFeeds[peer.localID]
    if (existing != null) {
      return existing.refCounted
    }

    const source = new Subject()
    const refCounted = pollFeedJSON(
      this._context.io.bzz,
      peer.publicFeed,
      { interval: 5 * MINUTE },
      // $FlowFixMe: ConnectableObservable pipe
    ).pipe(
      tap((data: PublicFeedSerialized) => {
        // This mutation emits the `peer_changed` event
        this._context.mutations.updatePeerProfile(
          peer.localID,
          data.profile || {},
        )
      }),
      multicast(source),
      refCount(),
    )

    this._peerFeeds[peer.localID] = { source, refCounted }
    return refCounted
  }

  _subscribe(userID: string, contact: Contact) {
    if (this._subscriptions[contact.localID] != null) {
      return
    }

    const peer = this._context.openVault.identities.getPeerUser(contact.peerID)
    if (peer == null) {
      this._context.log('No peer found for contact', contact)
      return
    }

    this._subscriptions[contact.localID] = this._getPeerFeed(peer).subscribe({
      next: () => {
        // Emit the `contact_changed` event so the profile mutation on the peer data can be observed by the subscription
        this._context.next({
          type: 'contact_changed',
          contact,
          userID,
          change: 'peerChanged',
        })
      },
      error: err => {
        this._context.log('contact feed subscription error', err)
      },
      complete: () => {
        delete this._subscriptions[contact.localID]
      },
    })

    // Delete subscription if contact gets deleted
    this._context
      .pipe(
        filter((e: ContextEvent) => {
          return e.type === 'contact_deleted' && e.contactID === contact.localID
        }),
      )
      .subscribe(() => {
        this._subscriptions[contact.localID].unsubscribe()
      })
  }

  _setup() {
    // Subscribe to peer deleted event to stop polling its feed
    this._peerDeletedSubscription = this._context
      .pipe(filter((e: ContextEvent) => e.type === 'peer_deleted'))
      .subscribe((e: PeerDeletedEvent) => {
        const feed = this._peerFeeds[e.peerID]
        if (feed != null) {
          feed.source.unsubscribe()
          delete this._peerFeeds[e.peerID]
        }
      })

    // Subscribe to all contacts
    const { contacts } = this._context.openVault.identities
    Object.keys(contacts).forEach((userID: string) => {
      // $FlowFixMe: Object.values() losing type
      Object.values(contacts[userID]).forEach((contact: Contact) => {
        this._subscribe(userID, contact)
      })
    })
  }

  add(userID: string, contact: Contact) {
    // Only add subscription for the contact if
    if (this._observers.size > 0) {
      this._subscribe(userID, contact)
    }
  }

  observe(): ObserveFeed<ContactChangedEvent> {
    if (this._observers.size === 0) {
      this._setup()
    }

    const source = this._context.pipe(filter(e => e.type === 'contact_changed'))
    this._observers.add(source)

    return {
      dispose: () => {
        this._observers.delete(source)
        if (this._observers.size === 0) {
          this.clear()
        }
      },
      source,
    }
  }

  clear() {
    super.clear()
    if (this._peerDeletedSubscription != null) {
      this._peerDeletedSubscription.unsubscribe()
    }
  }
}

export default FeedsHandler
