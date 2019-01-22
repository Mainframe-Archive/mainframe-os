// @flow

import { type Observable, Subject, type Subscription } from 'rxjs'
import { filter, multicast, refCount, tap } from 'rxjs/operators'

import type Contact from '../identity/Contact'
import type {
  default as PeerUserIdentity,
  PublicFeedSerialized,
} from '../identity/PeerUserIdentity'
import { PeerFeed } from '../swarm/feed'

import type ClientContext from './ClientContext'

type ObserveFeed<T = Object> = {
  dispose: () => void,
  source: Observable<T>,
}

const MINUTE = 60 * 1000

class FeedsHandler {
  _context: ClientContext
  _observers: Set<Observable<any>> = new Set()
  _subscriptions: { [id: string]: Subscription } = {}

  constructor(context: ClientContext) {
    this._context = context
  }

  remove(id: string) {
    const sub = this._subscriptions[id]
    if (sub != null) {
      sub.unsubscribe()
    }
  }

  clear() {
    Object.values(this._subscriptions).forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
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
export class ContactsFeedsHandler extends FeedsHandler {
  _peerFeeds: { [id: string]: Observable<PublicFeedSerialized> } = {}

  _getPeerFeed(peer: PeerUserIdentity): Observable<PublicFeedSerialized> {
    const existing = this._peerFeeds[peer.id]
    if (existing != null) {
      return existing
    }

    console.log('create peer feed observable', peer)

    const feed = new PeerFeed(this._context.io.bzz, peer.publicKey)
    this._peerFeeds[peer.id] = feed.pollJSON({ interval: 30 * MINUTE }).pipe(
      tap((data: PublicFeedSerialized) => {
        // This mutation emits the `peer_changed` event
        this._context.mutations.updatePeerProfile(peer.id, data.profile)
        console.log('update peer data', peer, data)
      }),
      multicast(new Subject()),
      refCount(),
    )
  }

  _subscribe(contact: Contact) {
    if (this._subscriptions[contact.localID] != null) {
      return
    }

    const peer = this._context.openVault.identities.getPeerUser(contact.peerID)
    if (peer == null) {
      this._context.log('No peer found for contact', contact)
      return
    }

    console.log('subscribe to contact', contact)

    this._subscriptions[peer.id] = this._getPeerFeed(peer).subscribe(() => {
      // Emit the `contact_changed` event so the profile mutation on the peer data can be observed by the subscription
      this._context.next({ type: 'contact_changed', contact })
    })
  }

  _setup() {
    Object.values(this._context.openVault.identities.contacts).forEach(
      (contact: Contact) => this._subscribe(contact),
    )
  }

  add(contact: Contact) {
    // Only add subscription for the contact if
    if (this._observers.size > 0) {
      this._subscribe(contact)
    }
  }

  async observe(): Promise<ObserveFeed> {
    if (this._observers.size === 0) {
      await this._setup()
    }

    const source = this._context.pipe(filter(e => e.type === 'contact_changed'))
    this._observers.add(source)

    return {
      dispose: () => {
        this._observers.remove(source)
        if (this._observers.size === 0) {
          this.clear()
        }
      },
      source,
    }
  }
}

export default FeedsHandler
