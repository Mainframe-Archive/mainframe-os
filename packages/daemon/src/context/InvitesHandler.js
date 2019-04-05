// @flow

import { Web3EthAbi, type BaseContract } from '@mainframe/eth'
import { getFeedTopic } from '@erebos/api-bzz-base'
import createKeccakHash from 'keccak'
import { utils } from 'ethers'
import { filter } from 'rxjs/operators'
import { type Observable } from 'rxjs'
import type { bzzHash } from '../swarm/feed'

import type { OwnUserIdentity, PeerUserIdentity } from '../identity'
import type { InviteRequest } from '../identity/IdentitiesRepository'
import type Contact from '../identity/Contact'
import type ClientContext from './ClientContext'
import type {
  ContextEvent,
  EthNetworkChangedEvent,
  EthAccountsChangedEvent,
  InvitesChangedEvent,
  VaultOpenedEvent,
} from './types'

type ObserveInvites<T = Object> = {
  dispose: () => void,
  source: Observable<T>,
}

const INVITE_ABI = require('./inviteABI.json')

const contracts = {
  // mainnet: {
  //   token: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  //   invites: '0x6687b03F6D7eeac45d98340c8243e6a0434f1284',
  // },
  ropsten: {
    token: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
    invites: '0x2bD359aE51EA91a1e1b21e986B1df3607e4476f8',
  },
  ganache: {
    token: '0xB3E555c3dB7B983E46bf5a530ce1dac4087D2d8D',
    invites: '0x44aDa120A88555bfA4c485C9F72CB4F0AdFEE45A',
  },
}

const hash = (data: Buffer) => {
  const bytes = createKeccakHash('keccak256')
    .update(data)
    .digest()
  return '0x' + bytes.toString('hex')
}

const encodeAddress = (address: string) => {
  return Web3EthAbi.encodeParameter('address', address)
}

export default class InvitesHandler {
  _context: ClientContext
  _observers = new Set()
  _ethSubscriptions = new Set()

  constructor(context: ClientContext) {
    this._context = context
    this.subscribeToStateChanges()
  }

  async subscribeToStateChanges() {
    this._context.events.addSubscription(
      'invitesStateChanges',
      this._context
        .pipe(
          filter((e: ContextEvent) => {
            return (
              e.type === 'vault_opened' ||
              e.type === 'eth_network_changed' ||
              (e.type === 'eth_accounts_changed' && e.change === 'userDefault')
            )
          }),
        )
        .subscribe(
          async (
            e:
              | EthNetworkChangedEvent
              | EthAccountsChangedEvent
              | VaultOpenedEvent,
          ) => {
            if (e.type !== 'eth_network_changed') {
              // Only need to clear subs if on the same network
              this._ethSubscriptions.forEach(async subID => {
                await this._context.io.eth.unsubscribe(subID)
                this._ethSubscriptions.delete(subID)
              })
              // Ensure we have network when first opened
              await this._context.io.eth.fetchNetwork()
            }
            if (contracts[this._context.io.eth.networkName]) {
              this.setup()
            } else {
              this._context.log('Unsupported ethereum network')
            }
          },
        ),
    )
  }

  get tokenContract() {
    return this._context.io.eth.erc20Contract(
      contracts[this._context.io.eth.networkName].token,
    )
  }

  get invitesContract(): BaseContract {
    return this._context.io.eth.getContract(
      INVITE_ABI.abi,
      contracts[this._context.io.eth.networkName].invites,
    )
  }

  setup() {
    const { identities } = this._context.openVault
    Object.keys(identities.ownUsers).forEach(async id => {
      const user = identities.getOwnUser(id)
      if (user) {
        if (user.publicFeed.feedHash) {
          const feedhash = hash(Buffer.from(user.publicFeed.feedHash))
          await this.subscribeToEthEvents(user, feedhash)
          await this.fetchInvitesForUser(user, feedhash)
          this.fetchRejectedEvents(user, feedhash)
        }
      }
    })
  }

  // FETCH BLOCKCHAIN STATE

  async fetchInvitesForUser(user: OwnUserIdentity, userFeedHash: string) {
    // TODO: Only check new blocks
    try {
      if (!user.profile.ethAddress) {
        throw new Error(
          `Unable to fetch invites, no eth address found for: ${user.localID}`,
        )
      }

      const encodedAddress = encodeAddress(user.profile.ethAddress)
      const latestBlock = await this._context.io.eth.getLatestBlock()
      const creationBlock = await this.invitesContract.call('creationBlock')

      const params = {
        address: this.invitesContract.address,
        fromBlock: creationBlock,
        toBlock: latestBlock,
        topics: [encodedAddress, userFeedHash],
      }
      const events = await this.invitesContract.getPastEvents('Invited', params)
      for (let i = 0; i < events.length; i++) {
        await this.handleInviteEvent(user, events[i])
      }
    } catch (err) {
      this._context.log(`Error fetching blockchain invites: ${err}`)
      return []
    }
  }

  async fetchRejectedEvents(user: OwnUserIdentity, userFeedHash: string) {
    const creationBlock = await this.invitesContract.call('creationBlock')
    const latestBlock = await this._context.io.eth.getLatestBlock()

    const params = {
      fromBlock: creationBlock,
      toBlock: latestBlock,
      topics: [userFeedHash],
    }

    const events = await this.invitesContract.getPastEvents('Declined', params)
    events.forEach(e => {
      try {
        this.handleRejectedEvent(user, e)
      } catch (err) {
        this._context.log(err)
      }
    })
  }

  async checkInviteState(sender: string, recipient: string, feed: ?bzzHash) {
    const params = [sender, recipient, feed]
    const res = await this.invitesContract.call('getInviteState', params)
    return utils.parseBytes32String(res)
  }

  handleRejectedEvent = async (
    user: OwnUserIdentity,
    event: Object,
  ): Promise<void> => {
    const { identities } = this._context.openVault
    const peer = identities.getPeerByFeed(event.recipientFeed)
    if (peer) {
      const contact = identities.getContactByPeerID(user.localID, peer.localID)
      if (contact && contact.invite) {
        contact.invite.stake.state = 'seized'
      }
      this._context.next({
        type: 'contact_changed',
        contact,
        userID: user.localID,
        change: 'inviteDeclined',
      })
    }
  }

  handleInviteEvent = async (
    user: OwnUserIdentity,
    contractEvent: Object,
  ): Promise<void> => {
    const { identities } = this._context.openVault
    if (contractEvent.senderFeed) {
      try {
        let peer = identities.getPeerByFeed(contractEvent.senderFeed)
        if (peer) {
          const contact = identities.getContactByPeerID(
            user.localID,
            peer.localID,
          )
          if (contact) {
            // Already connected
            return
          }
        }
        peer = await this._context.mutations.addPeerByFeed(
          contractEvent.senderFeed,
        )
        const topic = getFeedTopic({ name: user.base64PublicKey() })
        const feedValue = await this._context.io.bzz.getFeedValue(
          { user: peer.firstContactAddress, topic },
          {
            mode: 'content-response',
          },
        )
        if (feedValue) {
          const feed = await feedValue.json()
          const inviteState = await this.checkInviteState(
            contractEvent.senderAddress,
            contractEvent.recipientAddress,
            user.publicFeed.feedHash,
          )
          const storedInvites = identities.getInvites(user.localID)
          if (inviteState === 'PENDING' && !storedInvites[peer.localID]) {
            const contactInvite = {
              privateFeed: feed.privateFeed,
              receivedAddress: contractEvent.recipientAddress,
              senderAddress: contractEvent.senderAddress,
              peerID: peer.localID,
            }
            identities.setInviteRequest(user.localID, contactInvite)
            this._context.next({
              type: 'invites_changed',
              userID: user.localID,
              contact: this._context.queries.getContactFromInvite(
                contactInvite,
              ),
              change: 'inviteReceived',
            })
          }
        }
      } catch (err) {
        this._context.log(`Error fetching feed: ${err}`)
      }
    }
  }

  // INVITE ACTIONS

  async approveTransfer(fromAddress: string) {
    const txOptions = { from: fromAddress }
    return new Promise((resolve, reject) => {
      this.tokenContract
        .approve(this.invitesContract.address, 100, txOptions)
        .then(res => {
          res.on('mined', hash => {
            resolve(hash)
          })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async sendInviteTX(user: OwnUserIdentity, peer: PeerUserIdentity) {
    return new Promise((resolve, reject) => {
      // TODO: Notify launcher and request permission from user?
      if (!user.profile.ethAddress) {
        throw new Error('No eth address found for user')
      }
      const txOptions = { from: user.profile.ethAddress }
      this.approveTransfer(user.profile.ethAddress)
        .then(() => {
          this.invitesContract
            .send(
              'sendInvite',
              [
                peer.profile.ethAddress,
                peer.publicFeed,
                user.publicFeed.feedHash,
              ],
              txOptions,
            )
            .then(inviteRes => {
              inviteRes.on('hash', hash => {
                resolve(hash)
              })
              inviteRes.on('error', err => {
                reject(err)
              })
            })
            .catch(err => {
              reject(err)
            })
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  async sendInvite(userID: string, contact: Contact): Promise<void> {
    const user = this._context.openVault.identities.getOwnUser(userID)
    if (!user) {
      throw new Error('User not found')
    }
    if (!user.profile.ethAddress) {
      throw new Error('No public eth address found on profile')
    }
    const peer = this._context.openVault.identities.getPeerUser(contact.peerID)
    if (!peer) {
      throw new Error('Peer not found')
    }
    if (!peer.profile.ethAddress) {
      throw new Error('No public eth address found for Contact')
    }

    const stake = await this.invitesContract.call('requiredStake')
    const mftBalance = await this.tokenContract.getBalance(
      // $FlowFixMe address checked above
      user.profile.ethAddress,
    )
    const stakeBN = utils.bigNumberify(stake)
    const balanceBN = utils.parseUnits(mftBalance, 'ether')

    if (stakeBN.gt(balanceBN)) {
      throw new Error(
        `Insufficient MFT balance of ${balanceBN.toString()} for required stake ${stakeBN.toString()}`,
      )
    }

    const pushContactEvent = (contact, change) => {
      this._context.next({
        type: 'contact_changed',
        userID: userID,
        contact,
        change,
      })
    }

    try {
      const inviteTXHash = await this.sendInviteTX(user, peer)
      contact._invite = {
        ...contact._invite,
        inviteTX: inviteTXHash,
        stake: {
          amount: stakeBN.toString(),
          state: 'staked',
        },
      }
      pushContactEvent(contact, 'inviteSent')
    } catch (err) {
      contact._invite = undefined
      pushContactEvent(contact, 'inviteFailed')
      throw err
    }
  }

  async signAccepted(inviteRequest: InviteRequest): Promise<string> {
    const { wallets } = this._context.openVault
    if (!wallets.getEthWalletByAccount(inviteRequest.receivedAddress)) {
      throw new Error(
        `Could not find a wallet containing address: ${
          inviteRequest.receivedAddress
        }`,
      )
    }

    const addr = inviteRequest.senderAddress.substr(2)
    const messageHex = hash(Buffer.from(addr, 'hex'))

    const acceptanceSignature = await this._context.io.eth.signData({
      address: inviteRequest.receivedAddress,
      data: messageHex,
    })
    return acceptanceSignature
  }

  async retrieveStake(userID: string, contact: Contact) {
    const peer = this._context.openVault.identities.getPeerUser(contact.peerID)
    if (!peer) {
      throw new Error('Peer not found')
    }
    const invite = contact._invite
    if (invite != null && invite.stake && invite.acceptedSignature) {
      const signature = invite.acceptedSignature.substr(2) //remove 0x
      const r = '0x' + signature.slice(0, 64)
      const s = '0x' + signature.slice(64, 128)
      const v = '0x' + signature.slice(128, 130)
      const vNum = utils.bigNumberify(v).toNumber()

      const txOptions = { from: invite.fromAddress }
      const res = await this.invitesContract.send(
        'retrieveStake',
        [invite.toAddress, peer.publicFeed, vNum, r, s],
        txOptions,
      )

      const emitContactChange = (contact, change) => {
        this._context.next({
          contact,
          type: 'contact_changed',
          userID: userID,
          change: change,
        })
      }

      return new Promise((resolve, reject) => {
        res
          .on('hash', hash => {
            // TODO: Also set from reading contract events
            // in case reclaimed from outside of MFOS
            invite.stake.state = 'reclaiming'
            emitContactChange(contact, 'stakeReclaimProcessing')
            resolve(hash)
          })
          .on('mined', hash => {
            invite.stake.state = 'reclaimed'
            invite.stake.reclaimedTX = hash
            emitContactChange(contact, 'stakeReclaimMined')
          })
          .on('error', err => {
            invite.stake.state = 'staked'
            emitContactChange(contact, 'stakeError')
            reject(err)
          })
      })
    } else {
      throw new Error('Invite approval signature not found')
    }
  }

  async rejectContactInvite(userID: string, peerID: string) {
    const { identities } = this._context.openVault
    const inviteRequest = identities.getInviteRequest(userID, peerID)
    const peer = identities.getPeerUser(peerID)
    const user = identities.getOwnUser(userID)
    if (!peer) {
      throw new Error('Peer not found')
    }
    if (!user) {
      throw new Error(`User not found: ${userID}`)
    }
    if (!inviteRequest) {
      throw new Error('Invite not found')
    }
    const txOptions = { from: inviteRequest.receivedAddress }
    try {
      const res = await this.invitesContract.send(
        'declineAndWithdraw',
        [
          inviteRequest.senderAddress,
          peer.publicFeed,
          user.publicFeed.feedHash,
        ],
        txOptions,
      )

      return new Promise((resolve, reject) => {
        res
          .on('hash', async hash => {
            inviteRequest.rejectedTXHash = hash
            await this._context.openVault.save()
            resolve(hash)
          })
          .on('error', err => {
            reject(err)
          })
      })
    } catch (err) {
      throw err
    }
  }

  // SUBSCRIPTIONS

  async subscribeToEthEvents(user: OwnUserIdentity, userFeedHash: string) {
    const { eth } = this._context.io
    try {
      if (!eth.web3Provider.on) {
        this._context.log('Ethereum subscriptions not supported')
        return
      }
      if (!user.profile.ethAddress) {
        this._context.log('No ethereum address on profile to subscribe to')
        return
      }
      const encodedAddress = encodeAddress(user.profile.ethAddress)
      const invitesSubID = await this.invitesContract.subscribeToEvents(
        'Invited',
        [encodedAddress, userFeedHash],
      )
      const declinedSub = await this.invitesContract.subscribeToEvents(
        'Declined',
        [userFeedHash],
      )
      this._ethSubscriptions.add(invitesSubID)
      this._ethSubscriptions.add(declinedSub)

      const handleEvent = (name, log, handler) => {
        try {
          const event = this.invitesContract.decodeEventLog(name, log.result)
          handler(user, event)
        } catch (err) {
          this._context.log(err.message)
        }
      }
      // $FlowFixMe subscription compatibility already checked
      eth.web3Provider.on(invitesSubID, async msg => {
        handleEvent('Invited', msg, this.handleInviteEvent)
      })

      // $FlowFixMe subscription compatibility already checked
      eth.web3Provider.on(declinedSub, async msg => {
        handleEvent('Declined', msg, this.handleRejectedEvent)
      })
    } catch (err) {
      this._context.log(err.message)
    }
  }

  observe(): ObserveInvites<InvitesChangedEvent> {
    const source = this._context.pipe(filter(e => e.type === 'invites_changed'))
    this._observers.add(source)

    return {
      dispose: () => {
        this._observers.delete(source)
      },
      source,
    }
  }
}
