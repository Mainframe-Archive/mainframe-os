// @flow

import { getFeedTopic } from '@erebos/api-bzz-base'
import { Timeline, type Chapter } from '@erebos/timeline'
import type { SignedContents } from '@mainframe/secure-file'
import { type Observable, Subject, type Subscription } from 'rxjs'
import { filter, multicast, refCount, tap, flatMap } from 'rxjs/operators'
import semver from 'semver'

import type App from '../app/App'
import type Contact, {
  FirstContactPayload,
  ContactPayload,
} from '../identity/Contact'
import type {
  default as PeerUserIdentity,
  PublicFeedSerialized,
} from '../identity/PeerUserIdentity'
import { pollFeedJSON } from '../swarm/feed'

import type ClientContext from './ClientContext'
import type {
  AppInstalledEvent,
  AppUpdateEvent,
  ContextEvent,
  ContactChangedEvent,
  ContactCreatedEvent,
  PeerDeletedEvent,
} from './types'

type ObserveFeed<T = Object> = {
  dispose: () => void,
  source: Observable<T>,
}

const MINUTE = 60 * 1000
const DEFAULT_POLL_INTERVAL = 5 * MINUTE

class FeedsHandler {
  _context: ClientContext
  _observers: Set<Observable<any>> = new Set()
  _subscriptions: { [ref: string]: Subscription } = {}

  constructor(context: ClientContext) {
    this._context = context
  }

  remove(ref: string) {
    const sub = this._subscriptions[ref]
    if (sub != null) {
      sub.unsubscribe()
      delete this._subscriptions[ref]
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

export class AppsUpdatesHandler extends FeedsHandler {
  _appInstalledSubscription: ?Subscription

  _setup() {
    this._appInstalledSubscription = this._context
      .pipe(filter((e: ContextEvent) => e.type === 'app_installed'))
      .subscribe((e: AppInstalledEvent) => {
        this.add(e.app.id)
      })

    // $FlowFixMe: Object.values() losing type
    Object.values(this._context.openVault.apps.apps).forEach((app: App) => {
      this._subscribe(app)
    })
  }

  _subscribe(app: App) {
    const { io, log, openVault } = this._context

    const timeline = new Timeline({ bzz: io.bzz, feed: app.updateFeedHash })
    this._subscriptions[app.id] = timeline
      .live({ interval: DEFAULT_POLL_INTERVAL })
      .subscribe({
        next: (chapters: Array<Chapter<SignedContents>>) => {
          try {
            const chapter = chapters[chapters.length - 1]
            const manifest = app.verifyManifest(chapter.content.manifest)
            if (semver.lte(manifest.version, app.manifest.version)) {
              // Ignore this version
              return
            }

            const existing = openVault.apps.getUpdate(app.id)
            if (
              existing == null ||
              (semver.gt(manifest.version, existing.app.manifest.version) &&
                existing.app.installationState !== 'downloading')
            ) {
              openVault.apps.setUpdate(app.id, manifest)
              this._context.next({
                type: 'app_update',
                app,
                version: manifest.version,
                status: 'updateAvailable',
              })
            }
          } catch (err) {
            log('Manifest verification failed', err)
          }
        },
        error: err => {
          log('Failed to read app update feed', err)
        },
      })
  }

  add(appID: string) {
    const app = this._context.openVault.apps.getByID(appID)
    if (app == null) {
      throw new Error('App not found')
    }
    if (this._subscriptions[appID] == null && this._observers.size > 0) {
      this._subscribe(app)
    }
  }

  clear() {
    super.clear()
    if (this._appInstalledSubscription != null) {
      this._appInstalledSubscription.unsubscribe()
    }
  }

  observe(): ObserveFeed<AppUpdateEvent> {
    if (this._observers.size === 0) {
      this._setup()
    }

    const source = this._context.pipe(filter(e => e.type === 'app_update'))
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

const peerSubscriptionRef = (contact: Contact): string =>
  `${contact.localID}-peerFeed`

const contactSubscriptionRef = (contact: Contact): string =>
  `${contact.localID}-contactFeed`

const contactFeedChangeSubscriptionRef = (contact: Contact): string =>
  `${contact.localID}-contactFeedChange`

export class ContactsFeedsHandler extends FeedsHandler {
  _peerFeeds: { [localID: string]: PeerFeed } = {}
  _peerDeletedSubscription: ?Subscription
  _contactCreatedSubscription: ?Subscription

  _getPeerFeed(peer: PeerUserIdentity): Observable<PublicFeedSerialized> {
    const existing = this._peerFeeds[peer.localID]
    if (existing != null) {
      return existing.refCounted
    }

    const source = new Subject()
    const refCounted = pollFeedJSON(
      this._context.io.bzz,
      peer.publicFeed,
      { interval: DEFAULT_POLL_INTERVAL },
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
    if (!this._subscribePeerFeed(userID, contact)) return
    if (!this._subscribeContactFeed(userID, contact)) return

    // Delete subscription if contact gets deleted
    const sub = this._context
      .pipe(
        filter((e: ContextEvent) => {
          return e.type === 'contact_deleted' && e.contactID === contact.localID
        }),
      )
      .subscribe(() => {
        this._unsubscribe(contact)
        sub.unsubscribe()
      })
  }

  _subscribePeerFeed(userID: string, contact: Contact): boolean {
    const peerSubRef = peerSubscriptionRef(contact)
    if (this._subscriptions[peerSubRef] != null) {
      return false
    }

    const peer = this._context.openVault.identities.getPeerUser(contact.peerID)
    if (peer == null) {
      this._context.log('No peer found for contact', contact)
      return false
    }

    this._subscriptions[peerSubRef] = this._getPeerFeed(peer).subscribe({
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
        this._context.log('peer feed subscription error', err)
      },
      complete: () => {
        delete this._subscriptions[peerSubRef]
      },
    })

    return true
  }

  _subscribeContactFeed(userID: string, contact: Contact): boolean {
    const contactSubRef = contactSubscriptionRef(contact)
    const feedChangeSubRef = contactFeedChangeSubscriptionRef(contact)
    if (this._subscriptions[contactSubRef] != null) {
      return false
    }

    const user = this._context.openVault.identities.getOwnUser(userID)
    const peer = this._context.openVault.identities.getPeerUser(contact.peerID)
    if (user == null || peer == null) {
      this._context.log(
        `No ${user == null ? 'user' : 'peer'} found for contact`,
        contact,
      )
      return false
    }

    // Resubscribe if feedHash changes
    if (this._subscriptions[feedChangeSubRef] == null) {
      this._subscriptions[feedChangeSubRef] = this._context
        .pipe(
          filter((e: ContextEvent) => {
            return (
              e.type === 'contact_changed' &&
              e.contact.localID === contact.localID &&
              e.change === 'remoteFeed'
            )
          }),
        )
        .subscribe(() => {
          this.remove(contactSubRef)
          const res = this._subscribeContactFeed(userID, contact)
          this._context.log('contact feed resubscription:', res)
        })
    }

    if (contact.connectionState !== 'connected') {
      this._context.io.bzz
        .pollFeedValue(
          {
            user: peer.firstContactAddress,
            topic: getFeedTopic({ name: user.base64PublicKey() }),
          },
          {
            mode: 'content-response',
            whenEmpty: 'ignore',
            contentChangedOnly: true,
            immediate: true,
            interval: DEFAULT_POLL_INTERVAL,
          },
        )
        .pipe(flatMap(res => res.json()))
        .subscribe({
          next: (data: FirstContactPayload) => {
            // TODO: validate payload version
            this._context.mutations.setContactFeed(
              userID,
              contact.localID,
              data.privateFeed,
            )
          },
          error: err => {
            this._context.log('contact feed subscription error', err)
          },
          complete: () => {
            delete this._subscriptions[contactSubRef]
          },
        })
    } else {
      this._subscriptions[contactSubRef] = contact.sharedFeed
        .pollRemoteData(this._context.io.bzz, {
          interval: DEFAULT_POLL_INTERVAL,
        })
        .subscribe({
          next: (data: ContactPayload) => {
            // TODO: validate payload version
            if (data.profile != null) {
              this._context.mutations.updateContactProfile(
                userID,
                contact.localID,
                data.profile,
              )
            }
            if (data.acceptanceSignature != null) {
              this._context.mutations.updateContactAccepted(
                userID,
                contact.localID,
                data.acceptanceSignature,
              )
            }
            if (data.apps != null) {
              this._context.mutations.updateContactApps(
                userID,
                contact.localID,
                data.apps,
              )
            }
          },
          error: err => {
            this._context.log('contact feed subscription error', err)
          },
          complete: () => {
            delete this._subscriptions[contactSubRef]
          },
        })
    }

    return true
  }

  _unsubscribe(contact: Contact) {
    this.remove(peerSubscriptionRef(contact))
    this.remove(contactSubscriptionRef(contact))
    this.remove(contactFeedChangeSubscriptionRef(contact))
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

    // Subscribe to contact request sent event to start polling new contacts
    this._contactCreatedSubscription = this._context
      .pipe(
        filter(
          (e: ContextEvent) =>
            e.type === 'contact_changed' && e.change === 'requestSent',
        ),
      )
      .subscribe((e: ContactCreatedEvent) => {
        this.add(e.userID, e.contact)
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
    if (this._contactCreatedSubscription != null) {
      this._contactCreatedSubscription.unsubscribe()
    }
  }
}

export default FeedsHandler
