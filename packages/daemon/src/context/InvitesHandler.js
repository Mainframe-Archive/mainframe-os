// @flow

import { Web3EthAbi } from '@mainframe/eth'
import { fromWei } from 'ethjs-unit'
import { getFeedTopic } from '@erebos/api-bzz-base'
import createKeccakHash from 'keccak'
import { utils } from 'ethers'

import type { OwnUserIdentity, PeerUserIdentity } from '../identity'
import type { InviteRequest } from '../identity/IdentitiesRepository'
import type Contact from '../identity/Contact'
import type ClientContext from './ClientContext'

const INVITE_ABI = require('./inviteABI.json')

const inviteContracts = {
  mainnet: '0x',
  ropsten: '0x6687b03F6D7eeac45d98340c8243e6a0434f1284',
  ganache: '0xAaC2FeAbfe6e8c0de3851c527fFE4AcAaC98ad9D',
}

const tokenContracts = {
  mainnet: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  ganache: '0x3C35b3c7d8Ab0E47B90Df587Dd8D33234340E10C',
}

const hash = (data: Buffer) => {
  const bytes = createKeccakHash('keccak256')
    .update(data)
    .digest()
  return '0x' + bytes.toString('hex')
}

export default class InvitesHandler {
  _context: ClientContext

  constructor(context: ClientContext) {
    this._context = context
    this._context.events.addSubscription(
      'invitesVaultOpened',
      this._context.events.vaultOpened.subscribe(async () => {
        await this._context.io.eth.fetchNetwork()
        this.fetchBlockchainEvents()
      }),
    )
  }

  get tokenContract() {
    return this._context.io.eth.erc20Contract(
      tokenContracts[this._context.io.eth.networkName],
    )
  }

  get invitesContract() {
    return this._context.io.eth.getContract(
      INVITE_ABI.abi,
      inviteContracts[this._context.io.eth.networkName],
    )
  }

  fetchBlockchainEvents() {
    Object.keys(this._context.openVault.identities.ownUsers).forEach(
      async id => {
        await this.fetchInvitesForUser(id)
        this.fetchRejectedEvents(id)
      },
    )
  }

  async fetchRejectedEvents(userID: string) {
    const { identities } = this._context.openVault
    const user = identities.getOwnUser(userID)
    if (!user) {
      throw new Error(`User not found: ${userID}`)
    }

    const creationBlock = await this.invitesContract.call('creationBlock')
    const latestBlock = await this._context.io.eth.getLatestBlock()

    if (!user.publicFeed.feedHash) {
      throw new Error(`No public feed hash for user ${userID}`)
    }
    const hashedFeed = hash(Buffer.from(user.publicFeed.feedHash))

    const params = {
      fromBlock: creationBlock,
      toBlock: latestBlock,
      topics: [hashedFeed],
    }

    const events = await this.invitesContract.getPastEvents('Declined', params)
    events.forEach(e => {
      const peer = identities.getPeerByFeed(e.recipientFeed)
      if (peer) {
        const contact = identities.getContactByPeerID(userID, peer.localID)
        if (contact && contact.invite) {
          contact.invite.stake.state = 'seized'
        }
        this._context.next({
          type: 'contact_changed',
          contact,
          userID: userID,
          change: 'inviteDeclined',
        })
      }
    })
  }

  async checkInviteState(sender: string, recipient: string, feed: string) {
    const params = [sender, recipient, feed]
    const res = await this.invitesContract.call('getInviteState', params)
    return utils.parseBytes32String(res)
  }

  async parseEvent(
    contractEvent: Object,
    user: OwnUserIdentity,
  ): Promise<?InviteRequest> {
    const { identities } = this._context.openVault
    if (contractEvent.senderFeed) {
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

      try {
        const topic = getFeedTopic({ name: user.base64PublicKey() })
        const feedValue = await this._context.io.bzz.getFeedValue(
          peer.firstContactAddress,
          { topic },
          {
            mode: 'content-response',
          },
        )
        if (feedValue) {
          const feed = await feedValue.json()
          // TODO: Validation
          const inviteState = await this.checkInviteState(
            contractEvent.senderAddress,
            contractEvent.recipientAddress,
            contractEvent.recipientFeed,
          )
          if (inviteState === 'PENDING') {
            const contactInvite = {
              privateFeed: feed.privateFeed,
              receivedAddress: contractEvent.recipientAddress,
              senderAddress: contractEvent.senderAddress,
              peerID: peer.localID,
            }
            return contactInvite
          }
        }
      } catch (err) {
        this._context.log(`Error fetching feed: ${err}`)
      }
    }
  }

  async fetchInvitesForUser(userID: string) {
    // TODO: Only check new blocks
    const { identities } = this._context.openVault

    try {
      const user = identities.getOwnUser(userID)
      if (!user) {
        throw new Error(`User not found: ${userID}`)
      }

      const storedInvites = identities.getInvites(user.localID)
      const encodedAddress = Web3EthAbi.encodeParameter(
        'address',
        user.profile.ethAddress,
      )
      if (!user.publicFeed.feedHash) {
        throw new Error(`No public feed hash for user ${userID}`)
      }
      const hashedFeed = hash(Buffer.from(user.publicFeed.feedHash))
      const latestBlock = await this._context.io.eth.getLatestBlock()
      const creationBlock = await this.invitesContract.call('creationBlock')

      const params = {
        address: this.invitesContract.address,
        fromBlock: creationBlock,
        toBlock: latestBlock,
        topics: [encodedAddress, hashedFeed],
      }

      const events = await this.invitesContract.getPastEvents('Invited', params)
      for (let i = 0; i < events.length; i++) {
        const pendingInvite = await this.parseEvent(events[i], user)
        if (pendingInvite && !storedInvites[pendingInvite.peerID]) {
          storedInvites[pendingInvite.peerID] = pendingInvite
          identities.setInviteRequest(userID, pendingInvite)
        }
      }
      // TODO: trigger event and save
      await this._context.openVault.save()
    } catch (err) {
      this._context.log(`Error fetching blockchain invites: ${err}`)
      return []
    }
  }

  async sendInviteTX(user: OwnUserIdentity, peer: PeerUserIdentity) {
    return new Promise((resolve, reject) => {
      // TODO: Notify launcher and request permission from user?
      // TODO: check approved value
      if (!user.profile.ethAddress) {
        throw new Error('No eth address found for user')
      }
      const txOptions = { from: user.profile.ethAddress }
      this.tokenContract
        .approve(this.invitesContract.address, 100, txOptions)
        .then(res => {
          res.on('mined', () => {
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

    const stakeBN = utils.bigNumberify(fromWei(stake, 'ether'))
    const balanceBN = utils.bigNumberify(mftBalance)

    if (stakeBN.gt(balanceBN)) {
      throw new Error(
        `Insufficient MFT balance of ${balanceBN.toString()} for required stake ${stakeBN.toString()}`,
      )
    }

    const inviteTXHash = await this.sendInviteTX(user, peer)
    contact._invite = {
      inviteTX: inviteTXHash,
      // $FlowFixMe toAddress address checked above
      toAddress: peer.profile.ethAddress,
      // $FlowFixMe fromAddress address checked above
      fromAddress: user.profile.ethAddress,
      stake: {
        amount: stakeBN.toString(),
        state: 'staked',
      },
    }
    this._context.next({
      type: 'contact_changed',
      contact,
      userID: userID,
      change: 'invite',
    })
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
}
