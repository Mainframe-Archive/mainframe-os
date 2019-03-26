// @flow

import { Web3EthAbi } from '@mainframe/eth'
import { sha3, fromWei } from 'web3-utils'
import { getFeedTopic } from '@erebos/api-bzz-base'
import EthUtil from 'ethereumjs-util'
import { ethers } from 'ethers'

import type { OwnUserIdentity, PeerUserIdentity } from '../identity'
import type { InviteRequest } from '../identity/IdentitiesRepository'
import type Contact from '../identity/Contact'
import INVITE_ABI from './inviteABI.json'
import type ClientContext from './ClientContext'

const inviteContracts = {
  mainnet: '0x',
  ropsten: '0x6687b03F6D7eeac45d98340c8243e6a0434f1284',
  ganache: '0x474167fb5009454DF2d1E66537f43f7D52Daa131',
}

const tokenContracts = {
  mainnet: '0x',
  ropsten: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
  ganache: '0xa94b97E6327C59e7481910724276af96EF65cb8D',
}

export default class InvitesHandler {
  _context: ClientContext

  constructor(context: ClientContext) {
    this._context = context
    //TODO: use context sub with dispose
    const sub = this._context.events.vaultOpened.subscribe(async () => {
      this._context.subscriptions.set(sub)
      await this._context.io.eth.fetchNetwork()
      this.fetchInvites()
    })
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

  fetchInvites() {
    Object.keys(this._context.openVault.identities.ownUsers).forEach(id => {
      this.fetchInvitesForUser(id)
    })
  }

  async parseEvent(
    contractEvent: Object,
    user: OwnUserIdentity,
  ): Promise<?InviteRequest> {
    if (contractEvent.senderFeed) {
      let peer = this._context.openVault.identities.getPeerByFeed(
        contractEvent.senderFeed,
      )
      if (peer) {
        const contact = this._context.openVault.identities.getContactByPeerID(
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
          const contactInvite = {
            privateFeed: feed.privateFeed,
            receivedAddress: contractEvent.recipientAddress,
            senderAddress: contractEvent.sender,
            peerID: peer.localID,
          }
          return contactInvite
        }
      } catch (err) {
        this._context.log(`Error fetching feed: ${err}`)
      }
    }
  }

  async fetchInvitesForUser(userID: string) {
    // const contractAddress = contracts[this._context.io.eth.networkName]
    // TODO: Only check new blocks
    // TODO: Don't allow adding self, maybe error in contract also
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
      const encodedFeed = sha3(user.publicFeed.feedHash)

      const latest = await this._context.io.eth.getLatestBlock()

      const params = {
        address: this.invitesContract.address,
        fromBlock: latest - 10000,
        toBlock: latest,
        topics: [encodedAddress, encodedFeed],
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
    const stakeAmount = Number(fromWei(stake, 'ether'))
    const balanceAmount = Number(mftBalance)

    if (balanceAmount < stakeAmount) {
      throw new Error(
        `Insufficient MFT balance of ${balanceAmount} for required stake ${stakeAmount}`,
      )
    }

    const inviteTXHash = await this.sendInviteTX(user, peer)
    contact._invite = {
      txHash: inviteTXHash,
      // $FlowFixMe toAddress address checked above
      toAddress: peer.profile.ethAddress,
      // $FlowFixMe fromAddress address checked above
      fromAddress: user.profile.ethAddress,
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

    // const hexString = EthUtil.bufferToHex(EthUtil.keccak(inviteRequest.receivedAddress))
    // console.log('hex: ', hexString)
    const messageHash = EthUtil.keccak(inviteRequest.receivedAddress)
    const binMessage = ethers.utils.arrayify(messageHash)
    const binHex = EthUtil.bufferToHex(new Buffer(binMessage))
    const acceptanceSignature = await this._context.io.eth.signData({
      address: inviteRequest.receivedAddress,
      data: binHex,
    })
    return acceptanceSignature
  }

  async withdrawStake() {
    // const signedMessage =
    //   '0x75a923ab171774ba38fbb0f926d425b729b86f25dd113659092eb4f3c57212b8479ed339c9925f554f10d9859889bc4a2c4cc2493b790863eef83aa88123d7971b'
    // const hexString = toHex('accepted')
    // const sig = signedMessage.substr(2) //remove 0x
    // const r = '0x' + sig.slice(0, 64)
    // const s = '0x' + sig.slice(64, 128)
    // const v = '0x' + sig.slice(128, 130)
    // const vDecimal = toDecimal(v)
    // const res = await this.invitesContract.call('recoverAddress', [
    //   hexString,
    //   vDecimal,
    //   r,
    //   s,
    // ])
    // console.log('address recover: ', res)
  }
}
