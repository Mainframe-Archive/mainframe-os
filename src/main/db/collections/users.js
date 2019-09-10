// @flow

import { Bzz } from '@erebos/api-bzz-node'
import { createKeyPair, sign } from '@erebos/secp256k1'
import { EthClient, ETH_RPC_URLS, type TXParams } from '@mainframe/eth'
import { is } from 'electron-util'
import objectHash from 'object-hash'
import { type Observable, Subject, Subscription } from 'rxjs'
import { debounceTime, filter, flatMap, map } from 'rxjs/operators'

import { MF_PREFIX } from '../../../constants'

import { writePeer } from '../../data/protocols'
import type { Environment } from '../../environment'
import OwnFeed from '../../swarm/OwnFeed'
import { createPublisher } from '../../swarm/feeds'
import WalletProvider from '../../blockchain/WalletProvider'
import InvitesHandler from '../../blockchain/InvitesHandler'

import { COLLECTION_NAMES } from '../constants'
import type { Collection, CollectionParams, Doc } from '../types'
import { generateKeyPair, generateLocalID } from '../utils'

import schema, { type UserData } from '../schemas/user'
import type { ContactData } from '../schemas/contact'
import type { GenericProfile } from '../schemas/genericProfile'

import type { ContactRequestDoc } from './contactRequests'
import type { ContactDoc } from './contacts'
import type { EthWalletHDDoc } from './ethWalletsHD'
import type { EthWalletLedgerDoc } from './ethWalletsLedger'
import type { UserAppVersionDoc } from './userAppVersions'

type UserMethods = {|
  hasEthWallet(): boolean,
  getBzz(): Bzz,
  getEth(): EthClient,
  getInvitesSync(): ?InvitesHandler,
  getPublicID(): string,
  getPublicFeed(): OwnFeed,
  getSharedKey(peerKey: any): Buffer,
  getAppsVersions(): Promise<Array<UserAppVersionDoc>>,
  getEthAccounts(): Promise<Array<string>>,
  initEthClient(): EthClient,
  checkEthConnection(): void,
  getRequiredContactStake(): Promise<string>,
  observeContactAdded(): Observable<ContactDoc>,
  addContact(publicID: string, data?: $Shape<ContactData>): Promise<ContactDoc>,
  addContactFromRequest(request: ContactRequestDoc): Promise<void>,
  addContactRequest(id: string): Promise<void>,
  addEthHDWallet(id: string): Promise<void>,
  addEthLedgerWallet(id: string): Promise<void>,
  setProfileEthAddress(address: string): Promise<void>,
  findContactByPeer(peerID: string): Promise<?ContactDoc>,
  findContactRequestByPeer(peerID: string): Promise<?ContactRequestDoc>,
  removeContact(id: string): Promise<void>,
  removeContactRequest(request: Object): Promise<void>,
  findHDWallet(address: string): Promise<?EthWalletHDDoc>,
  findLedgerWallet(address: string): Promise<?EthWalletLedgerDoc>,
  findWalletOfAddress(
    address: string,
  ): Promise<EthWalletHDDoc | EthWalletLedgerDoc | void>,
  signEthTransaction(params: TXParams): Promise<string>,
  signEthData(params: { address: string, data: string }): Promise<string>,
  startPublicProfilePublication(): rxjs$TeardownLogic,
  stopPublicProfilePublication(): void,
  startPublicProfileToggle(): rxjs$TeardownLogic,
  stopPublicProfileToggle(): void,
  startContactsSync(): rxjs$TeardownLogic,
  stopContactsSync(): void,
  startInvitesSync(env: Environment): void,
  startSync(env: Environment): rxjs$TeardownLogic,
  stopSync(): void,
|}

type UserPopulate = {|
  contacts: Array<ContactDoc>,
  contactRequests: Array<ContactRequestDoc>,
  'ethWallets.hd': Array<EthWalletHDDoc>,
  'ethWallets.ledger': Array<EthWalletLedgerDoc>,
|}

export type UserDoc = Doc<UserData, UserMethods, UserPopulate>

type UsersStatics = {|
  create(data: {
    profile: GenericProfile,
    privateProfile?: boolean,
  }): Promise<UserDoc>,
  startSync(env: Environment): Promise<void>,
  stopSync(): void,
|}

export type UsersCollection = Collection<UserData, UserDoc> & UsersStatics

export default async (params: CollectionParams): Promise<UsersCollection> => {
  const db = params.db
  const logger = params.logger.child({ collection: COLLECTION_NAMES.USERS })

  return await db.collection<UserData, UserDoc, UserMethods, UsersStatics>({
    name: COLLECTION_NAMES.USERS,
    schema,
    statics: {
      async create(data: {
        profile: GenericProfile,
        privateProfile?: boolean,
      }): Promise<UserDoc> {
        return await this.insert({
          ...data,
          localID: generateLocalID(),
          keyPair: generateKeyPair(),
        })
      },

      async startSync(env: Environment): Promise<void> {
        if (this._sync != null) {
          logger.warn('Collection already syncing, ignoring startSync() call')
          return
        }

        logger.debug('Start collection sync')
        this._sync = new Subscription()

        const docs = await this.find().exec()
        docs.forEach(doc => {
          this._sync.add(doc.startSync(env))
        })

        this._sync.add(
          this.insert$
            .pipe(
              flatMap(async event => {
                const doc = await this.findOne(event.data.doc).exec()
                this._sync.add(doc.startSync(env))
              }),
            )
            .subscribe({
              error: err => {
                logger.log({
                  level: 'error',
                  message: 'Collection sync error with added doc',
                  error: err.toString(),
                })
              },
            }),
        )
      },

      stopSync(): void {
        if (this._sync != null) {
          logger.debug('Stop collection sync')
          this._sync.unsubscribe()
          this._sync = null
        }
      },
    },
    methods: {
      hasEthWallet(): boolean {
        return (
          this.ethWallets.hd.length > 0 || this.ethWallets.ledger.length > 0
        )
      },

      getBzz(): Bzz {
        if (this._bzz == null) {
          this._bzz = new Bzz({
            signBytes: async (bytes, key) => sign(bytes, key),
            url: this.bzzURL,
          })
        }
        return this._bzz
      },

      getEth(): EthClient {
        if (this._ethClient == null) {
          this._ethClient = this.initEthClient()
        } else {
          this.checkEthConnection() // Handle WS connection dropping
        }
        // $FlowFixMe null checked above
        return this._ethClient
      },

      getInvitesSync(): ?InvitesHandler {
        return this.invitesSync
      },

      getPublicID(): string {
        return this.getPublicFeed().address.replace('0x', MF_PREFIX.PEER)
      },

      getPublicFeed(): OwnFeed {
        if (this._publicFeed == null) {
          this._publicFeed = new OwnFeed(this.keyPair.privateKey)
        }
        return this._publicFeed
      },

      getSharedKey(peerKey: any): Buffer {
        return createKeyPair(this.keyPair.privateKey)
          .derive(peerKey)
          .toBuffer()
      },

      async getAppsVersions(): Promise<Array<UserAppVersionDoc>> {
        return await db.user_app_versions.find({ user: this.localID }).exec()
      },

      async getEthAccounts(): Promise<Array<string>> {
        let accounts = []
        for (const type of ['hd', 'ledger']) {
          const wallets = await this.populate(`ethWallets.${type}`)
          for (const w of wallets) {
            accounts = accounts.concat(w.activeAccounts.map(a => a.address))
          }
        }
        return accounts
      },

      initEthClient(): EthClient {
        return new EthClient(
          is.development ? ETH_RPC_URLS.WS.ropsten : this.ethURL,
          new WalletProvider(this),
        )
      },

      checkEthConnection(): void {
        // Handle WS disconnects
        if (
          this._ethClient &&
          this._ethClient.web3Provider.isConnecting &&
          !this._ethClient.web3Provider.isConnecting() &&
          !this._ethClient.web3Provider.connected
        ) {
          this._ethClient = this.initEthClient()
        }
      },

      async getRequiredContactStake(): Promise<string> {
        return await this.invitesSync.getRequiredStake()
      },

      observeContactAdded(): Observable<ContactDoc> {
        if (this._contactAdded$ == null) {
          this._contactAdded$ = new Subject()
        }
        return this._contactAdded$.asObservable()
      },

      async addContact(
        publicID: string,
        data: $Shape<ContactData> = {},
        signature?: string,
      ): Promise<ContactDoc> {
        logger.log({
          level: 'debug',
          message: 'Add contact for user',
          userID: this.localID,
          contactPublicID: publicID,
        })

        const bzz = this.getBzz()

        let peer = await db.peers.findByPublicID(publicID)
        if (peer == null) {
          logger.log({
            level: 'debug',
            message: 'No existing peer for this contact, creating it',
            userID: this.localID,
            contactPublicID: publicID,
          })
          // eslint-disable-next-line require-atomic-updates
          peer = await db.peers.createFromID(bzz, publicID)
          logger.log({
            level: 'debug',
            message: 'Peer created',
            userID: this.localID,
            contactPublicID: publicID,
            peerID: peer.localID,
          })
        } else {
          logger.log({
            level: 'debug',
            message: 'Peer found',
            userID: this.localID,
            contactPublicID: publicID,
            peerID: peer.localID,
          })
        }

        const existingContacts = await this.populate('contacts')
        const existingContact = existingContacts.find(
          contact => contact.peer === peer.localID,
        )

        if (existingContact != null) {
          logger.log({
            level: 'debug',
            message: 'Contact already exists',
            userID: this.localID,
            contactID: existingContact.localID,
            contactPublicID: publicID,
            peerID: peer.localID,
          })
          return existingContact
        }

        const contact = db.contacts.newDocument({
          profile: {
            name: undefined,
            avatar: undefined,
            ethAddress: undefined,
          },
          ...data,
          localID: generateLocalID(),
          keyPair: generateKeyPair(),
          peer: peer.localID,
          firstContactFeedCreated: true, // Created below, before saving doc
        })
        await contact.createFirstContactFeed(this, signature)
        await contact.save()
        logger.log({
          level: 'debug',
          message: 'Contact created',
          userID: this.localID,
          contactID: contact.localID,
          contactPublicID: publicID,
          peerID: peer.localID,
        })

        await this.update({ $addToSet: { contacts: contact.localID } })
        logger.log({
          level: 'debug',
          message: 'Contact added to user',
          userID: this.localID,
          contactID: contact.localID,
          contactPublicID: publicID,
          peerID: peer.localID,
        })

        if (this._contactAdded$ != null) {
          this._contactAdded$.next(contact)
        }

        return contact
      },

      async addContactFromRequest(request: ContactRequestDoc): Promise<void> {
        logger.log({
          level: 'debug',
          message: 'Adding contact from request',
          peerID: request.peer,
        })
        const acceptSig = await this.invitesSync.signAccepted(request)
        const data = {
          publicKey: request.publicKey,
        }
        const publicID = await request.getPublicID()
        const contact = await this.addContact(publicID, data, acceptSig)
        await this.removeContactRequest(request)
        return contact
      },

      async removeContact(id: string): Promise<void> {
        await this.atomicSet(
          'contacts',
          this.contacts.filter(cid => cid !== id),
        )
        const contact = await db.contacts.findOne(id).exec()
        if (contact != null) {
          contact.stopSync()
          await contact.remove()
        }
      },

      async addContactRequest(id: string): Promise<void> {
        await this.update({ $addToSet: { contactRequests: id } })
      },

      async removeContactRequest(request: Object): Promise<void> {
        await this.atomicSet(
          'contactRequests',
          this.contactRequests.filter(cid => cid !== request.localID),
        )
        await request.remove()
      },

      async findContactRequestByPeer(
        peerID: string,
      ): Promise<?ContactRequestDoc> {
        const requests = await this.populate('contactRequests')
        return requests.find(r => r.peer === peerID)
      },

      async findContactByPeer(peerID: string): Promise<?ContactDoc> {
        const contacts = await this.populate('contacts')
        return contacts.find(c => c.peer === peerID)
      },

      async addEthHDWallet(id: string): Promise<void> {
        await this.update({ $addToSet: { 'ethWallets.hd': id } })
      },

      async addEthLedgerWallet(id: string): Promise<void> {
        await this.update({ $addToSet: { 'ethWallets.ledger': id } })
      },

      async setProfileEthAddress(address: string): Promise<void> {
        await this.atomicSet('profile.ethAddress', address)
      },

      async findHDWallet(address: string): Promise<Object> {
        const wallets = await this.populate('ethWallets.hd')
        return wallets.find(w => {
          return w.activeAccounts.map(a => a.address).includes(address)
        })
      },

      async findLedgerWallet(address: string): Promise<Object> {
        const wallets = await this.populate('ethWallets.ledger')
        return wallets.find(w => {
          return w.activeAccounts.map(a => a.address).includes(address)
        })
      },

      async findWalletOfAddress(address: string): Promise<Object> {
        return (
          (await this.findHDWallet(address)) ||
          (await this.findLedgerWallet(address))
        )
      },

      async signEthTransaction(params: TXParams): Promise<string> {
        const wallet = await this.findWalletOfAddress(params.from)
        if (!wallet) {
          throw new Error(`No wallet found for user ${this.localID}`)
        }
        return wallet.signTransaction(params)
      },

      async signEthData(params: {
        address: string,
        data: string,
      }): Promise<string> {
        const wallet = await this.findWalletOfAddress(params.address)
        if (!wallet) {
          throw new Error(`No wallet found for address ${params.address}`)
        }
        return wallet.sign(params)
      },

      startPublicProfilePublication(): rxjs$TeardownLogic {
        if (this._publicProfilePublication != null) {
          logger.log({
            level: 'warn',
            message: 'Public profile publication is already started',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start public profile publication',
          id: this.localID,
        })

        const publish = createPublisher({
          bzz: this.getBzz(),
          feed: this.getPublicFeed(),
          transform: writePeer,
        })
        this._publicProfilePublication = this.profile$
          .pipe(
            debounceTime(10000),
            map(profile => ({ hash: objectHash(profile), profile })),
            filter(data => data.hash !== this.profileHash),
            flatMap(async data => {
              const hash = await publish({
                publicKey: this.keyPair.publicKey,
                profile: data.profile,
              })
              await this.atomicSet('profileHash', data.hash)
              return { hash, profile: data.profile }
            }),
          )
          .subscribe({
            next: data => {
              logger.log({
                level: 'debug',
                message: 'Public profile published',
                id: this.localID,
                data,
              })
            },
            error: err => {
              logger.log({
                level: 'error',
                message: 'Public profile publication error',
                id: this.localID,
                error: err.toString(),
              })
            },
          })

        return () => {
          this.stopPublicProfilePublication()
        }
      },

      stopPublicProfilePublication(): void {
        if (this._publicProfilePublication != null) {
          logger.log({
            level: 'debug',
            message: 'Stop public profile publication',
            id: this.localID,
          })
          this._publicProfilePublication.unsubscribe()
          this._publicProfilePublication = null
        }
      },

      startPublicProfileToggle(): rxjs$TeardownLogic {
        if (this._publicProfilePublicationToggle == null) {
          logger.log({
            level: 'debug',
            message: 'Start public profile toggle',
            id: this.localID,
          })
          this._publicProfilePublicationToggle = this.privateProfile$.subscribe(
            {
              next: (isPrivate: boolean) => {
                if (isPrivate && this._publicProfilePublication != null) {
                  this.stopPublicProfilePublication()
                } else if (
                  !isPrivate &&
                  this._publicProfilePublication == null
                ) {
                  this.startPublicProfilePublication()
                }
              },
              error: err => {
                logger.log({
                  level: 'error',
                  message:
                    'Public profile publication toggle subscription error',
                  id: this.localID,
                  error: err.toString(),
                })
              },
            },
          )
        } else {
          logger.log({
            level: 'warn',
            message: 'Public profile publication is already setup',
            id: this.localID,
          })
        }

        return () => {
          this.stopPublicProfileToggle()
        }
      },

      stopPublicProfileToggle(): void {
        this.stopPublicProfilePublication()
        if (this._publicProfilePublicationToggle != null) {
          logger.log({
            level: 'debug',
            message: 'Stop public profile toggle',
            id: this.localID,
          })
          this._publicProfilePublicationToggle.unsubscribe()
          this._publicProfilePublicationToggle = null
        }
      },

      startInvitesSync(env: Environment): void {
        if (this.invitesSync != null) {
          logger.log({
            level: 'warn',
            message: 'Invites sync is already started',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start invites sync',
          id: this.localID,
        })

        const handlerParams = {
          user: this,
          logger,
          env,
          db,
        }

        this.invitesSync = new InvitesHandler(handlerParams)

        // return () => {
        //   this.stopInvitesSync()
        // }
      },

      // stopInvitesSync() {
      //   if (this.invitesSync != null) {
      //     logger.log({
      //       level: 'debug',
      //       message: 'Stop invites sync',
      //       id: this.localID,
      //     })
      //     this.invitesSync.unsubscribe()
      //     this.invitesSync = null
      //   }
      // },

      startContactsSync(): rxjs$TeardownLogic {
        if (this._contactsSync != null) {
          logger.log({
            level: 'warn',
            message: 'Contacts sync is already started',
            id: this.localID,
          })
          return
        }

        logger.log({
          level: 'debug',
          message: 'Start contacts sync',
          id: this.localID,
        })

        this._contactsSync = new Subscription()
        // Sync existing contacts
        this.populate('contacts').then(contacts => {
          contacts.forEach(contact => {
            this._contactsSync.add(contact.startSync(this))
          })
        })
        // Sync new contacts
        this.observeContactAdded().subscribe(contact => {
          this._contactsSync.add(contact.startSync(this))
        })

        return () => {
          this.stopContactsSync()
        }
      },

      stopContactsSync(): void {
        if (this._contactsSync != null) {
          logger.log({
            level: 'debug',
            message: 'Stop contacts sync',
            id: this.localID,
          })
          this._contactsSync.unsubscribe()
          this._contactsSync = null
        }
      },

      startSync(env: Environment): rxjs$TeardownLogic {
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
        this._sync.add(this.startPublicProfileToggle())
        this._sync.add(this.startContactsSync())
        this._sync.add(this.startInvitesSync(env))

        return () => {
          this.stopSync()
        }
      },

      stopSync(): void {
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
