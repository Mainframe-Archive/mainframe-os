// @flow

import { type FeedParams, getFeedTopic } from '@erebos/api-bzz-base'
import type Bzz from '@erebos/api-bzz-node'
import { pubKeyToAddress } from '@erebos/keccak256'
import { createKeyPair, createPublic } from '@erebos/secp256k1'
import { Subscription } from 'rxjs'
import { filter, flatMap } from 'rxjs/operators'

import { MF_PREFIX } from '../../../constants'

import { encode, createDecoder } from '../../crypto'
import { readFirstContact, writeFirstContact } from '../../data/protocols'
import { createSubscriber } from '../../swarm/feeds'
import OwnFeed from '../../swarm/OwnFeed'

import { COLLECTION_NAMES } from '../constants'
import type { CollectionParams } from '../types'

import schema from '../schemas/contact'
import { generateKeyPair, generateLocalID } from '../utils'

const FIRST_CONTACT_FEED_NAME = 'mf:first-contact:v1'

export const getFirstContactFeed = (from: string, to: string): FeedParams => ({
  user: from,
  topic: getFeedTopic({ name: FIRST_CONTACT_FEED_NAME, topic: to }),
})

export type ConnectionState =
  | 'connected'
  | 'sent_feed'
  | 'sending_feed'
  | 'declined'
  | 'sending_blockchain'
  | 'sent_blockchain'

export default async (params: CollectionParams) => {
  const db = params.db
  const logger = params.logger.child({ collection: COLLECTION_NAMES.CONTACTS })

  return await db.collection({
    name: COLLECTION_NAMES.CONTACTS,
    schema,
    statics: {
      async create(data: Object = {}) {
        return await this.insert({
          ...data,
          localID: generateLocalID(),
          keyPair: generateKeyPair(),
        })
      },

      // Return all contacts a peer has
      async findByPeerID(peer: string) {
        return await this.find({ peer }).exec()
      },
    },
    methods: {
      getConnectionState(): ConnectionState {
        if (!this.firstContactFeedCreated) {
          return 'sending_feed'
        }
        if (this.publicKey != null) {
          return 'connected'
        }
        if (this.invite != null) {
          switch (this.invite.stakeState) {
            case 'sending':
              return 'sending_blockchain'
            case 'staked':
              return 'sent_blockchain'
            case 'seized':
              return 'declined'
            default:
              break
          }
        }
        return 'sent_feed'
      },

      // Own ID specific to provide to the contact for confidential first contact feed access
      getPrivateID(): string {
        return MF_PREFIX.CONTACT + this.keyPair.publicKey
      },

      getPublicKey(): ?string {
        if (this._publicKey == null && this.publicKey != null) {
          this._publicKey = createPublic(this.publicKey).getPublic()
        }
        return this._publicKey
      },

      // Used for the GraphQL object
      async getInfo() {
        const invite =
          this.invite == null
            ? null
            : {
                ethNetwork: this.invite.ethNetwork,
                inviteTX: this.invite.inviteTX,
                stakeAmount: this.invite.stakeAmount,
                stakeState: this.invite.stakeState,
              }
        const peer = await this.populate('peer')

        const profile = {
          name: this.aliasName || this.profile.name || peer.profile.name,
          ethAddress: this.profile.ethAddress || peer.profile.ethAddress,
          avatar: this.profile.avatar || peer.profile.avatar,
        }

        return {
          localID: this.localID,
          peerID: peer.localID,
          publicID: peer.getPublicID(),
          connectionState: this.getConnectionState(),
          profile,
          invite,
        }
      },

      // Alias to ID of the peer
      async getPublicID(): Promise<string> {
        const peer = await this.populate('peer')
        return peer.getPublicID()
      },

      async getUser(): Promise<Object | null> {
        const user = await db.users
          .findOne({ contacts: { $in: [this.localID] } })
          .exec()
        if (user === null) {
          logger.log({
            level: 'warn',
            message: 'Could not find user for contact',
            id: this.localID,
          })
        }
        return user
      },

      async getFirstContactData(
        user: Object,
      ): Promise<{
        userAddress: string,
        peerAddress: string,
        sharedKey: Buffer,
      }> {
        const peer = await this.populate('peer')
        return await peer.getFirstContactData(user)
      },

      async createFirstContactFeed(user: Object, signature?: string) {
        logger.log({
          level: 'debug',
          message: 'Create first contact feed',
          contactID: this.localID,
          userID: user.localID,
        })

        const {
          userAddress,
          peerAddress,
          sharedKey,
        } = await this.getFirstContactData(user)

        // First contact feed is deterministic based on the user's and peer's public addresses, and a constant name
        const feed = new OwnFeed(
          user.keyPair.privateKey,
          getFirstContactFeed(userAddress, peerAddress),
        )

        const payload = await encode(
          sharedKey,
          writeFirstContact({
            contact: {
              signature,
              publicKey: this.keyPair.publicKey,
            },
            peer: {
              publicFeed: userAddress,
            },
          }),
        )

        await feed.publishJSON(user.getBzz(), payload)

        logger.log({
          level: 'debug',
          message: 'First contact feed created',
          contactID: this.localID,
          userID: user.localID,
          feed: feed.feed,
        })
      },

      startConnectedSubscription(user: Object) {
        if (this._connectedSubscription != null) {
          logger.log({
            level: 'warn',
            message: 'Connected subscription is already started',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start connected subscription',
          id: this.localID,
        })

        if (this.publicKey == null) {
          throw new Error(
            'Cannot start connected subscription without the public key',
          )
        }

        const pubKey = this.getPublicKey()
        const sharedKey = createKeyPair(this.keyPair.privateKey)
          .derive(pubKey)
          .toBuffer()
        const decode = createDecoder(sharedKey)

        this._connectedSubscription = createSubscriber({
          bzz: user.getBzz(),
          feed: { user: pubKeyToAddress(pubKey.encode()) },
          transform: payload => {
            try {
              // TODO: readContact() protocol
              return decode(payload)
            } catch (err) {
              logger.log({
                level: 'warn',
                message: 'Error reading connected payload',
                error: err.toString(),
              })
              return null
            }
          },
        }).subscribe({
          next: data => {
            logger.log({
              level: 'debug',
              message: 'Connected subscription update',
              id: this.localID,
              data,
            })
          },
          error: err => {
            logger.log({
              level: 'error',
              message: 'Connected subscription error',
              id: this.localID,
              error: err.toString(),
            })
          },
        })
      },

      stopConnectedSubscription() {
        if (this._connectedSubscription != null) {
          logger.log({
            level: 'debug',
            message: 'Stop connected subscription',
            id: this.localID,
          })
          this._connectedSubscription.unsubscribe()
          this._connectedSubscription = null
        }
      },

      async startFirstContactSubscription(user: Object) {
        if (this._firstContactSubscription != null) {
          logger.log({
            level: 'warn',
            message: 'First contact subscription is already started',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start first contact subscription',
          id: this.localID,
        })

        const {
          userAddress,
          peerAddress,
          sharedKey,
        } = await this.getFirstContactData(user)
        const decode = createDecoder(sharedKey)
        const feed = getFirstContactFeed(peerAddress, userAddress)
        logger.log({
          level: 'debug',
          message: 'Subscribe to first contact feed',
          id: this.localID,
          feed,
        })

        this._firstContactSubscription = createSubscriber({
          bzz: user.getBzz(),
          feed: feed,
          interval: 60 * 1000, // 1 min
          transform: payload => {
            logger.log({
              level: 'debug',
              message: 'Received first contact payload',
              id: this.localID,
            })
            try {
              return readFirstContact(decode(payload))
            } catch (err) {
              logger.log({
                level: 'warn',
                message: 'Error reading first contact payload',
                id: this.localID,
                error: err.toString(),
              })
              return null
            }
          },
        })
          .pipe(
            filter(data => data != null),
            flatMap(async data => {
              console.log('contact data: ', data)
              if (data.contact.signature) {
                await this.atomicSet(
                  'invite.acceptedSignature',
                  data.contact.signature,
                )
              }
              await this.atomicSet('publicKey', data.contact.publicKey)
              return data
            }),
          )
          .subscribe({
            next: data => {
              logger.log({
                level: 'debug',
                message: 'First contact updated locally',
                id: this.localID,
                data,
              })
            },
            error: err => {
              logger.log({
                level: 'error',
                message: 'First contact subscription error',
                id: this.localID,
                error: err.toString(),
              })
            },
          })
      },

      stopFirstContactSubscription() {
        if (this._firstContactSubscription != null) {
          logger.log({
            level: 'debug',
            message: 'Stop first contact subscription',
            id: this.localID,
          })
          this._firstContactSubscription.unsubscribe()
          this._firstContactSubscription = null
        }
      },

      startStateToggle(user: Object) {
        if (this._stateToggle == null) {
          logger.log({
            level: 'debug',
            message: 'Start connection state toggle',
            id: this.localID,
          })
          this._stateToggle = this.publicKey$.subscribe({
            next: (pubKey: ?string) => {
              if (pubKey == null) {
                this.stopConnectedSubscription()
                if (this._firstContactSubscription == null) {
                  this.startFirstContactSubscription(user)
                }
              } else {
                this.stopFirstContactSubscription()
                if (this._connectedSubscription == null) {
                  this.startConnectedSubscription(user)
                }
              }
            },
            error: err => {
              logger.log({
                level: 'error',
                message: 'Connection state toggle error',
                id: this.localID,
                error: err.toString(),
              })
            },
          })
        } else {
          logger.log({
            level: 'warn',
            message: 'Connection state toggle is already setup',
            id: this.localID,
          })
        }

        return () => {
          this.stopStateToggle()
        }
      },

      stopStateToggle() {
        this.stopConnectedSubscription()
        this.stopFirstContactSubscription()
        if (this._stateToggle != null) {
          logger.log({
            level: 'debug',
            message: 'Stop connection state toggle',
            id: this.localID,
          })
          this._stateToggle.unsubscribe()
          this._stateToggle = null
        }
      },

      startSync(bzz: Bzz) {
        if (this._sync != null) {
          logger.log({
            level: 'warn',
            message: 'Document is already syncing, ignoring startSync() call',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start document sync',
          id: this.localID,
        })

        const deletedSub = this.deleted$.subscribe(deleted => {
          if (deleted) {
            logger.log({
              level: 'debug',
              message: 'Cleanup deleted document sync',
              id: this.localID,
            })
            this.stopSync()
          }
        })

        this._sync = new Subscription()
        this._sync.add(deletedSub)
        this._sync.add(this.startStateToggle(bzz))

        return () => {
          this.stopSync()
        }
      },

      stopSync() {
        if (this._sync != null) {
          logger.log({
            level: 'debug',
            message: 'Stop document sync',
            id: this.localID,
          })
          this._sync.unsubscribe()
          this._sync = null
        }
      },
    },
  })
}
