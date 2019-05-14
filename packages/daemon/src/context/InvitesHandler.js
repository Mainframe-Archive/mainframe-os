// @flow

import { type BaseContract } from '@mainframe/eth'
import { getFeedTopic } from '@erebos/api-bzz-base'
import createKeccakHash from 'keccak'
import { utils } from 'ethers'
import { filter } from 'rxjs/operators'
import { type Observable } from 'rxjs'

import type { OwnUserIdentity, PeerUserIdentity } from '../identity'
import type { InviteRequest } from '../identity/IdentitiesRepository'
import type Contact from '../identity/Contact'
import type ClientContext from './ClientContext'
import type {
  ContextEvent,
  EthNetworkChangedEvent,
  InvitesChangedEvent,
  VaultOpenedEvent,
} from './types'

type ObserveInvites<T = Object> = {
  dispose: () => void,
  source: Observable<T>,
}

//$FlowFixMe Cannot resolve module ./inviteABI.
const INVITE_ABI = require('./inviteABI.json')

const contracts = {
  mainnet: {
    token: '0xdf2c7238198ad8b389666574f2d8bc411a4b7428',
    invites: '0xa201792736D5B4357a34a2C7Bee983be56Ba51bf',
  },
  ropsten: {
    token: '0xa46f1563984209fe47f8236f8b01a03f03f957e4',
    invites: '0x2f554d5Ff0108618985489850393EA4923d6a3c1',
  },
  ganache: {
    token: '0xB3E555c3dB7B983E46bf5a530ce1dac4087D2d8D',
    invites: '0x44aDa120A88555bfA4c485C9F72CB4F0AdFEE45A',
  },
}

const bufferFromHex = (hex: string) => {
  return Buffer.from(hex.substr(2), 'hex')
}

const hash = (data: Buffer) => {
  const bytes = createKeccakHash('keccak256')
    .update(data)
    .digest()
  return '0x' + bytes.toString('hex')
}

const matchAddress = (addressHash: string, addresses: Array<string>) => {
  return addresses.find(a => {
    return hash(bufferFromHex(a)) === addressHash
  })
}

export default class InvitesHandler {
  _context: ClientContext
  _observers: Set<Observable<any>> = new Set()
  _ethSubscriptions: Set<string> = new Set()

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
              (e.type === 'user_changed' && e.change === 'publicFeed')
            )
          }),
        )
        .subscribe(async (e: EthNetworkChangedEvent | VaultOpenedEvent) => {
          if (e.type !== 'eth_network_changed') {
            await this._context.io.eth.fetchNetwork()
          }
          try {
            await this.setup()
          } catch (err) {
            this._context.log(
              `Error setting up invites handler: ${err.message}`,
            )
          }
        }),
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

  async setup() {
    const { identities } = this._context.openVault

    this.validateNetwork()

    Object.keys(identities.ownUsers).forEach(async id => {
      const user = identities.getOwnUser(id)
      if (user && user.publicFeed.feedHash) {
        const feedhash = hash(Buffer.from(user.publicFeed.feedHash))
        await this.subscribeToEthEvents(user, feedhash)
        await this.readEvents(user, feedhash, 'Invited', this.handleInviteEvent)
        await this.readEvents(
          user,
          feedhash,
          'Declined',
          this.handleDeclinedEvent,
        )
      }
    })
  }

  // FETCH BLOCKCHAIN STATE

  async readEvents(
    user: OwnUserIdentity,
    userFeedHash: string,
    type: 'Declined' | 'Invited',
    handler: (user: OwnUserIdentity, events: Array<Object>) => Promise<void>,
  ) {
    try {
      const creationBlock = await this.invitesContract.call('creationBlock')

      const params = {
        fromBlock: Number(creationBlock),
        toBlock: 'latest',
        topics: [userFeedHash],
      }
      const events = await this.invitesContract.getPastEvents(type, params)

      for (let i = 0; i < events.length; i++) {
        await handler(user, events[i])
      }

      await this._context.openVault.save()
    } catch (err) {
      this._context.log(`Error reading blockchain events: ${err}`)
      return []
    }
  }

  async checkInviteState(
    senderAddrHash: string,
    senderFeedHash: string,
    recipientAddrHash: string,
    recipientFeedHash: string,
  ) {
    const params = [
      senderAddrHash,
      senderFeedHash,
      recipientAddrHash,
      recipientFeedHash,
    ]
    const res = await this.invitesContract.call('getInviteState', params)
    return utils.parseBytes32String(res)
  }

  handleDeclinedEvent = async (
    user: OwnUserIdentity,
    event: Object,
  ): Promise<void> => {
    const { identities } = this._context.openVault
    const peerID = Object.keys(identities.peerUsers).find(id => {
      const peer = identities.peerUsers[id]
      return hash(Buffer.from(peer.publicFeed)) === event.recipientFeedHash
    })
    if (!peerID) {
      this._context.log('Peer not found')
      return
    }
    const peer = identities.getPeerUser(peerID)
    if (peer) {
      const contact = identities.getContactByPeerID(user.localID, peer.localID)
      if (contact && contact.invite) {
        contact.invite.stake.state = 'seized'
        this._context.next({
          type: 'invites_changed',
          userID: user.localID,
          change: 'inviteDeclined',
        })
        this._context.next({
          type: 'contact_changed',
          contact,
          userID: user.localID,
          change: 'inviteDeclined',
        })
      }
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

          const buffer = bufferFromHex(contractEvent.senderAddress)
          const senderAddrHash = hash(buffer)

          const inviteState = await this.checkInviteState(
            senderAddrHash,
            hash(Buffer.from(contractEvent.senderFeed)),
            contractEvent.recipientAddressHash,
            contractEvent.recipientFeedHash,
          )
          const storedInvites = identities.getInvites(user.localID)
          if (inviteState === 'PENDING' && !storedInvites[peer.localID]) {
            const accounts = this._context.queries.getUserEthAccounts(
              user.localID,
            )
            const receivedAddress = matchAddress(
              contractEvent.recipientAddressHash,
              accounts,
            )
            if (!receivedAddress) {
              this._context.log(
                'Failed to add invite due to missing receiving address',
              )
              return
            }
            const contactInvite = {
              ethNetwork: this._context.io.eth.networkName,
              privateFeed: feed.privateFeed,
              receivedAddress: receivedAddress,
              senderAddress: contractEvent.senderAddress,
              peerID: peer.localID,
            }
            identities.setInviteRequest(user.localID, contactInvite)
            const eventContact = this._context.queries.getContactFromInvite(
              contactInvite,
            )
            if (eventContact) {
              this._context.next({
                type: 'invites_changed',
                userID: user.localID,
                change: 'inviteReceived',
              })
            }
          }
        }
      } catch (err) {
        this._context.log(`Error fetching feed: ${err}`)
      }
    }
  }

  getUserObjects(
    userID: string,
    contactID: string,
  ): { user: OwnUserIdentity, peer: PeerUserIdentity, contact: Contact } {
    const { identities } = this._context.openVault
    const contact = identities.getContact(userID, contactID)
    if (!contact) {
      throw new Error('Contact not found')
    }
    const user = identities.getOwnUser(userID)
    if (!user) {
      throw new Error('User not found')
    }
    const peer = identities.getPeerUser(contact.peerID)
    if (!peer) {
      throw new Error('Peer not found')
    }
    if (!peer.profile.ethAddress) {
      throw new Error('No public ETH address found for Contact')
    }
    return { user, peer, contact }
  }

  // INVITE ACTIONS

  async checkAllowance(address: string) {
    const stake = await this.invitesContract.call('requiredStake')
    const allowance = await this.tokenContract.call('allowance', [
      address,
      this.invitesContract.address,
    ])
    const allowanceBN = utils.bigNumberify(allowance)
    const stakeBN = utils.bigNumberify(stake)
    return allowanceBN.gte(stakeBN)
  }

  async sendInviteApprovalTX(
    userID: string,
    contactID: string,
    gasPrice?: string,
    fromAddress?: string,
  ) {
    const { user } = this.getUserObjects(userID, contactID)
    if (!user.profile.ethAddress) {
      throw new Error('No public ETH address found on profile')
    }

    const hasAllowance = await this.checkAllowance(
      fromAddress ? fromAddress : user.profile.ethAddress,
    )
    if (hasAllowance) {
      return
    }

    const stake = await this.invitesContract.call('requiredStake')
    const stakeBN = utils.bigNumberify(stake)
    const mftBalance = await this.tokenContract.getBalance(
      // $FlowFixMe address checked above
      fromAddress ? fromAddress : user.profile.ethAddress,
    )

    const balanceBN = utils.parseUnits(mftBalance, 'ether')

    if (stakeBN.gt(balanceBN)) {
      const formattedStake = utils.formatUnits(stakeBN, 'ether')
      this._context.log('HIIIIIIIII')
      console.log('HELLEr')
      console.log(stakeBN)

      throw new Error(
        `Insufficient MFT balance of ${balanceBN.toString()} for required stake ${formattedStake}`,
      )
    }

    const txOptions: Object = {
      from: fromAddress ? fromAddress : user.profile.ethAddress,
    }
    // TODO: check high gasPrice

    const approveValue = utils.formatUnits(stake, 'ether')

    if (gasPrice) {
      txOptions.gasPrice = gasPrice
    }
    return new Promise((resolve, reject) => {
      this.tokenContract
        .approve(
          this.invitesContract.address,
          approveValue.toString(),
          txOptions,
        )
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

  async processInviteTransaction(
    user: OwnUserIdentity,
    peer: PeerUserIdentity,
  ) {
    return new Promise((resolve, reject) => {
      // TODO: Notify launcher and request permission from user?

      if (!peer.profile.ethAddress) {
        throw new Error('No ETH address found for recipient')
      }

      const toAddrHash = hash(bufferFromHex(peer.profile.ethAddress))
      const toFeedHash = hash(Buffer.from(peer.publicFeed))
      const params = [toAddrHash, toFeedHash, user.publicFeed.feedHash]

      const txOptions = { from: user.profile.ethAddress }

      this.invitesContract
        .send('sendInvite', params, txOptions)
        .then(inviteRes => {
          inviteRes.on('mined', hash => {
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
  }

  async sendInviteTX(
    userID: string,
    contactID: string,
    fromAddress?: string,
  ): Promise<void> {
    const { user, peer, contact } = this.getUserObjects(userID, contactID)
    if (!user.profile.ethAddress) {
      throw new Error('No public ETH address found in profile')
    }
    if (!peer.profile.ethAddress) {
      throw new Error('No public ETH address found for Contact')
    }

    const stake = await this.invitesContract.call('requiredStake')
    const mftBalance = await this.tokenContract.getBalance(
      // $FlowFixMe address checked above
      fromAddress ? fromAddress : user.profile.ethAddress,
    )
    const stakeBN = utils.bigNumberify(stake)
    const balanceBN = utils.parseUnits(mftBalance, 'ether')

    if (stakeBN.gt(balanceBN)) {
      const formattedStake = utils.formatUnits(stakeBN, 'ether')
      throw new Error(
        `Insufficient MFT balance of ${balanceBN.toString()} for required stake ${formattedStake}`,
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
      const inviteTXHash = await this.processInviteTransaction(user, peer)
      contact._invite = {
        inviteTX: inviteTXHash,
        ethNetwork: this._context.io.eth.networkName,
        // $FlowFixMe address already checked
        fromAddress: fromAddress ? fromAddress : user.profile.ethAddress,
        // $FlowFixMe address already checked
        toAddress: peer.profile.ethAddress,
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
    const addressHash = bufferFromHex(hash(Buffer.from(addr, 'hex')))

    const messageBytes = Buffer.concat([
      Buffer.from('MFOS Contact Accept:'),
      addressHash,
    ])

    const messageHex = '0x' + messageBytes.toString('hex')

    const acceptanceSignature = await this._context.io.eth.signData({
      address: inviteRequest.receivedAddress,
      data: messageHex,
    })
    return acceptanceSignature
  }

  signatureParams(signature: string) {
    const sig = signature.substr(2) //remove 0x
    const r = '0x' + sig.slice(0, 64)
    const s = '0x' + sig.slice(64, 128)
    const v = '0x' + sig.slice(128, 130)
    const vNum = utils.bigNumberify(v).toNumber()
    return { vNum, r, s }
  }

  async retrieveStake(
    userID: string,
    contactID: string,
    recipientAddress?: string,
  ) {
    const { peer, contact, user } = this.getUserObjects(userID, contactID)
    const invite = contact._invite
    if (invite != null && invite.stake && invite.acceptedSignature) {
      const sigParams = this.signatureParams(invite.acceptedSignature)

      // $FlowFixMe will have feedHash by this point
      const fromFeedHash = hash(Buffer.from(user.publicFeed.feedHash))
      const toAddrHash = hash(
        bufferFromHex(recipientAddress ? recipientAddress : invite.toAddress),
      )
      const toFeedHash = hash(Buffer.from(peer.publicFeed))

      const txOptions = { from: invite.fromAddress }
      this.validateInviteOriginNetwork(invite.ethNetwork)

      const res = await this.invitesContract.send(
        'retrieveStake',
        [
          toAddrHash,
          toFeedHash,
          fromFeedHash,
          sigParams.vNum,
          sigParams.r,
          sigParams.s,
        ],
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
          .on('hash', () => {
            // TODO: Also set from reading contract events
            // in case reclaimed from outside of MFOS
            invite.stake.state = 'reclaiming'
            emitContactChange(contact, 'stakeReclaimProcessing')
          })
          .on('mined', hash => {
            invite.stake.state = 'reclaimed'
            invite.stake.reclaimedTX = hash
            emitContactChange(contact, 'stakeReclaimMined')
            resolve(hash)
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

  async declineContactInvite(userID: string, peerID: string): Promise<string> {
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
    this.validateInviteOriginNetwork(inviteRequest.ethNetwork)

    // $FlowFixMe must have feedhash by this point
    const myFeedHash = hash(Buffer.from(user.publicFeed.feedHash))
    const fromAddressHash = hash(bufferFromHex(inviteRequest.senderAddress))
    const fromFeedHash = hash(Buffer.from(peer.publicFeed))

    const txOptions = { from: inviteRequest.receivedAddress }
    const res = await this.invitesContract.send(
      'declineAndWithdraw',
      [fromAddressHash, fromFeedHash, myFeedHash],
      txOptions,
    )

    return new Promise((resolve, reject) => {
      res
        .on('mined', async hash => {
          inviteRequest.rejectedTXHash = hash
          await this._context.openVault.save()

          this._context.next({
            type: 'invites_changed',
            userID: user.localID,
            change: 'inviteDeclined',
          })
          resolve(hash)
        })
        .on('error', err => {
          reject(err)
        })
    })
  }

  validateInviteOriginNetwork(ethNetwork: string) {
    if (ethNetwork !== this._context.io.eth.networkName) {
      throw new Error(
        `Please connect to the eth network (${ethNetwork}) this invite was originally sent from to withdraw this stake.`,
      )
    }
  }

  validateNetwork() {
    if (!contracts[this._context.io.eth.networkName]) {
      throw new Error(
        `Sorry, Ethereum network "${
          this._context.io.eth.networkName
        }" is not supported for contact invites`,
      )
    }
    if (
      this._context.env.type === 'production' &&
      this._context.io.eth.networkName !== 'mainnet'
    ) {
      throw new Error(
        `Sorry, this feature is only available on Ethereum mainnet, you are currently running on ${
          this._context.io.eth.networkName
        }.`,
      )
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
      const invitesSubID = await this.invitesContract.subscribeToEvents(
        'Invited',
        [userFeedHash],
      )
      const declinedSub = await this.invitesContract.subscribeToEvents(
        'Declined',
        [userFeedHash],
      )

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
        handleEvent('Declined', msg, this.handleDeclinedEvent)
      })
    } catch (err) {
      this._context.log(err.message)
    }
  }

  observe(): ObserveInvites<InvitesChangedEvent> {
    const source = this._context.pipe(
      filter(
        e => e.type === 'invites_changed' || e.type === 'contacts_changed',
      ),
    )
    this._observers.add(source)

    return {
      dispose: () => {
        this._observers.delete(source)
      },
      source,
    }
  }

  // ESTIMATE TX GAS

  async getRequiredStake(): Promise<string> {
    const stake = await this.invitesContract.call('requiredStake')
    return utils.formatUnits(stake, 'ether').toString()
  }

  async formatGasValues(txParams: {
    gas: string,
    gasPrice: string,
  }): Promise<{
    maxCost: string,
    gasPriceGwei: string,
    stakeAmount: string,
  }> {
    const stake = await this.invitesContract.call('requiredStake')

    const gasPriceBN = utils.bigNumberify(txParams.gasPrice)
    const gasLimitBN = utils.bigNumberify(txParams.gas)

    const maxCost = gasPriceBN.mul(gasLimitBN)
    return {
      stakeAmount: utils.formatUnits(stake, 'ether').toString(),
      maxCost: utils.formatUnits(maxCost, 'ether'),
      gasPriceGwei: utils.formatUnits(txParams.gasPrice, 'gwei'),
    }
  }

  async getDeclineTXDetails(userID: string, peerID: string): Promise<Object> {
    const { identities } = this._context.openVault
    const user = identities.getOwnUser(userID)
    if (!user) throw new Error('User not found')
    const peer = identities.getPeerUser(peerID)
    if (!peer) throw new Error('Peer not found')
    const inviteRequest = identities.getInviteRequest(userID, peerID)
    if (!inviteRequest) throw new Error('Invite request not found')
    this.validateInviteOriginNetwork(inviteRequest.ethNetwork)

    // $FlowFixMe will have feedHash by this point
    const myFeedHash = hash(Buffer.from(user.publicFeed.feedHash))
    const fromAddressHash = hash(bufferFromHex(inviteRequest.senderAddress))
    const fromFeedHash = hash(Buffer.from(peer.publicFeed))

    const data = this.invitesContract.encodeCall('declineAndWithdraw', [
      fromAddressHash,
      fromFeedHash,
      myFeedHash,
    ])

    const txOptions = {
      from: inviteRequest.receivedAddress,
      to: this.invitesContract.address,
      data,
    }
    const params = await this._context.io.eth.completeTxParams(txOptions)
    const formattedParams = await this.formatGasValues(params)
    return { ...params, ...formattedParams }
  }

  async getRetrieveStakeTXDetails(
    user: OwnUserIdentity,
    peer: PeerUserIdentity,
    contact: Contact,
  ): Promise<Object> {
    const invite = contact._invite
    if (invite != null && invite.stake && invite.acceptedSignature) {
      const sigParams = this.signatureParams(invite.acceptedSignature)

      // $FlowFixMe will have feedHash by this point
      const fromFeedHash = hash(Buffer.from(user.publicFeed.feedHash))
      const toAddrHash = hash(bufferFromHex(invite.toAddress))
      const toFeedHash = hash(Buffer.from(peer.publicFeed))

      const txParams = [
        toAddrHash,
        toFeedHash,
        fromFeedHash,
        sigParams.vNum,
        sigParams.r,
        sigParams.s,
      ]
      this.validateInviteOriginNetwork(invite.ethNetwork)
      const data = this.invitesContract.encodeCall('retrieveStake', txParams)
      const txOptions = {
        from: invite.fromAddress,
        to: this.invitesContract.address,
        data,
      }
      const params = await this._context.io.eth.completeTxParams(txOptions)
      const formattedParams = await this.formatGasValues(params)
      return { ...params, ...formattedParams }
    }
    throw new Error('Accepted signature not found')
  }

  async getApproveTXDetails(user: OwnUserIdentity): Promise<Object> {
    const { eth } = this._context.io
    const stake = await this.invitesContract.call('requiredStake')
    const data = this.tokenContract.encodeCall('approve', [
      this.invitesContract.address,
      stake,
    ])
    const txOptions = {
      from: user.profile.ethAddress,
      to: this.tokenContract.address,
      data,
    }
    const params = await eth.completeTxParams(txOptions)
    const formattedParams = await this.formatGasValues(params)
    return { ...params, ...formattedParams }
  }

  async getSendInviteTXDetails(
    user: OwnUserIdentity,
    peer: PeerUserIdentity,
    fromAddress?: string,
  ): Promise<Object> {
    const { eth } = this._context.io

    if (!peer.profile.ethAddress) {
      throw new Error('No eth address found for recipient')
    }

    const toAddrHash = hash(bufferFromHex(peer.profile.ethAddress))
    const toAddrFeed = hash(Buffer.from(peer.publicFeed))
    const params = [toAddrHash, toAddrFeed, user.publicFeed.feedHash]

    const data = this.invitesContract.encodeCall('sendInvite', params)
    const txOptions = {
      from: fromAddress ? fromAddress : user.profile.ethAddress,
      to: this.invitesContract.address,
      data,
    }
    const txParams = await eth.completeTxParams(txOptions)
    const formattedParams = await this.formatGasValues(txParams)
    return { ...txParams, ...formattedParams }
  }

  async getInviteTXDetails(
    type: string,
    userID: string,
    contactOrPeerID: string,
  ) {
    this.validateNetwork()
    if (type === 'declineInvite') {
      return this.getDeclineTXDetails(userID, contactOrPeerID)
    }
    const { user, peer, contact } = this.getUserObjects(userID, contactOrPeerID)
    switch (type) {
      case 'approve':
        return this.getApproveTXDetails(user)
      case 'sendInvite':
        return this.getSendInviteTXDetails(user, peer)
      case 'retrieveStake':
        return this.getRetrieveStakeTXDetails(user, peer, contact)
      default:
        throw new Error('Unknown transaction type')
    }
  }
}
