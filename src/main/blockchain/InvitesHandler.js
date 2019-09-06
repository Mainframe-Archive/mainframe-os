// @flow

import type { Bzz } from '@erebos/api-bzz-node'
import { type BaseContract, type EthClient } from '@mainframe/eth'
import createKeccakHash from 'keccak'
import { utils } from 'ethers'

import { decode } from '../crypto'
import { readFirstContact } from '../data/protocols'
import { getFirstContactFeed } from '../db/collections/contacts'
import type { ContactRequestDoc } from '../db/collections/contactRequests'
import type { UserDoc } from '../db/collections/users'
import type { DB } from '../db/types'
import type { Environment } from '../environment'
import type { Logger } from '../logger'

const INVITE_ABI = require('./invitesABI.json')

export type InviteData = {
  chain?: number,
  inviteTX: string,
  fromAddress: string,
  toAddress: string,
  acceptedSignature?: string,
  ethNetwork: string,
  stake: {
    amount: string,
    state: 'sending' | 'staked' | 'reclaiming' | 'reclaimed' | 'seized',
    reclaimedStakeTX?: ?string,
  },
}

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
  bzz: Bzz
  db: DB
  env: Environment
  ethClient: EthClient
  logger: Logger
  user: UserDoc

  constructor(params: {
    db: DB,
    user: UserDoc,
    env: Environment,
    logger: Logger,
  }) {
    this.db = params.db
    this.user = params.user
    this.logger = params.logger
    this.env = params.env
    this.ethClient = params.user.getEth()
    this.bzz = params.user.getBzz()
    this.setup()
  }

  get tokenContract() {
    return this.ethClient.erc20Contract(
      contracts[this.ethClient.networkName].token,
    )
  }

  get invitesContract(): BaseContract {
    return this.ethClient.getContract(
      INVITE_ABI.abi,
      contracts[this.ethClient.networkName].invites,
    )
  }

  async setup() {
    try {
      await this.validateNetwork()
      const feedhash = hash(Buffer.from(this.user.getPublicID()))
      await this.subscribeToEthEvents(feedhash)
      await this.readEvents(feedhash, 'Invited', this.handleInviteEvent)
      await this.readEvents(feedhash, 'Declined', this.handleDeclinedEvent)
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: 'Error reading invite events',
        error: err.toString(),
      })
    }
  }

  // FETCH BLOCKCHAIN STATE

  async readEvents(
    userFeedHash: string,
    type: 'Declined' | 'Invited',
    handler: (events: Array<Object>) => Promise<void>,
  ) {
    try {
      const creationBlock = await this.invitesContract.call('creationBlock')
      const params = {
        fromBlock: Number(creationBlock),
        toBlock: 'latest',
        topics: [userFeedHash],
      }
      const events = await this.invitesContract.getPastEvents(type, params)

      this.logger.log({
        level: 'debug',
        message: 'Fetched invite events',
        events: events.toString(),
      })

      for (let i = 0; i < events.length; i++) {
        await handler(events[i])
      }
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: 'Error reading blockchain events',
        error: err.toString(),
      })
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

  handleInviteEvent = async (contractEvent: Object): Promise<void> => {
    this.logger.log({
      level: 'debug',
      message: 'Handling invite event',
      contractEvent: contractEvent,
    })
    if (contractEvent.senderFeed) {
      try {
        let peer = await this.db.peers.findByPublicID(contractEvent.senderFeed)
        if (peer) {
          const contacts = await this.user.populate('contacts')
          const existing = contacts.find(c => c.peer === peer.localID)
          if (existing) {
            this.logger.log({
              level: 'debug',
              message: 'Invite already accepted',
              contactID: existing.localID,
            })
            return
          }
        } else {
          // eslint-disable-next-line require-atomic-updates
          peer = await this.db.peers.createFromID(
            this.bzz,
            contractEvent.senderFeed,
          )
        }
        const {
          userAddress,
          peerAddress,
          sharedKey,
        } = await peer.getFirstContactData(this.user)
        const feed = getFirstContactFeed(peerAddress, userAddress)
        const res = await this.bzz.getFeedContent(feed, {
          mode: 'raw',
        })
        if (!res) {
          throw new Error('First contact feed hash undefined')
        }
        const payload = await res.json()
        const firstContactFeed = await readFirstContact(
          decode(sharedKey, payload),
        )
        this.logger.log({
          level: 'debug',
          message: 'Found contact feed from blockchain invite',
          firstContactFeed,
        })

        const buffer = bufferFromHex(contractEvent.senderAddress)
        const senderAddrHash = hash(buffer)

        const inviteState = await this.checkInviteState(
          senderAddrHash,
          hash(Buffer.from(contractEvent.senderFeed)),
          contractEvent.recipientAddressHash,
          contractEvent.recipientFeedHash,
        )
        const existingInvite = await this.user.findContactRequestByPeer(
          peer.localID,
        )
        if (inviteState === 'PENDING' && !existingInvite) {
          const accounts = await this.user.getEthAccounts()
          const receivedAddress = matchAddress(
            contractEvent.recipientAddressHash,
            accounts,
          )
          if (!receivedAddress) {
            this.logger.log({
              level: 'warn',
              message: 'Receiving eth address not found',
              addressHash: contractEvent.recipientAddressHash,
            })
            return
          }
          const dbEntry = {
            ethNetwork: this.ethClient.networkName,
            publicKey: firstContactFeed.contact.publicKey,
            receivedAddress: receivedAddress,
            senderAddress: contractEvent.senderAddress,
            stakeAmount: contractEvent.stakeAmount.toString(),
            peer: peer.localID,
          }

          this.logger.log({
            level: 'debug',
            message: 'Saving contact request',
            dbEntry,
          })

          const contactRequest = await this.db.contact_requests.create(dbEntry)
          await this.user.addContactRequest(contactRequest.localID)

          // TODO: push db event
        }
      } catch (err) {
        this.logger.log({
          level: 'error',
          message: 'Error handling invite',
          error: err.toString(),
        })
      }
    }
  }

  handleDeclinedEvent = async (event: Object): Promise<void> => {
    this.logger.log({
      level: 'debug',
      message: 'Handling decline event',
      recipientFeedHash: event.recipientFeedHash,
    })
    const peers = await this.db.peers.find().exec()
    const peer = peers.find(p => {
      return hash(Buffer.from(p.getPublicID())) === event.recipientFeedHash
    })

    if (!peer) {
      this.logger.log({
        level: 'debug',
        message: 'Peer not found',
        id: event.recipientFeedHash,
      })
      return
    }
    const contact = await this.user.findContactByPeer(peer.localID)
    if (contact != null && contact.invite != null) {
      this.logger.log({
        level: 'debug',
        message: 'Setting contact state declined',
        id: event.recipientFeedHash,
      })
      // $FlowFixMe: nested key is not recognised
      await contact.atomicSet('invite.stakeState', 'seized')
    }
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
    contactID: string,
    walletAddress: string,
    gasPrice?: string,
  ) {
    const hasAllowance = await this.checkAllowance(walletAddress)
    if (hasAllowance) {
      return
    }

    const stake = await this.invitesContract.call('requiredStake')
    const stakeBN = utils.bigNumberify(stake)
    const mftBalance = await this.tokenContract.getBalance(walletAddress)

    const balanceBN = utils.parseUnits(mftBalance, 'ether')

    if (stakeBN.gt(balanceBN)) {
      const formattedStake = utils.formatUnits(stakeBN, 'ether')
      throw new Error(
        `Insufficient MFT balance of ${balanceBN.toString()} for required stake ${formattedStake}`,
      )
    }

    const txOptions: Object = { from: walletAddress }
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

  async getInviteParams(contactID: string) {
    const contact = await this.db.contacts.findOne(contactID).exec()
    if (!contact) {
      throw new Error(`Contact ${contactID} not found`)
    }
    const contactProfile = await contact.getProfile()

    if (!contactProfile.ethAddress) {
      throw new Error('No eth address found for recipient')
    }
    const toAddrHash = hash(bufferFromHex(contactProfile.ethAddress))
    const toFeedHash = hash(Buffer.from(await contact.getPublicID()))
    return [toAddrHash, toFeedHash, this.user.getPublicID()]
  }

  async processInviteTransaction(contactID: string, walletAddress: string) {
    // TODO: Notify launcher and request permission from user?
    const params = await this.getInviteParams(contactID)
    return await new Promise((resolve, reject) => {
      this.invitesContract
        .send('sendInvite', params, { from: walletAddress })
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

  async sendInviteTX(contactID: string, walletAddress: string): Promise<void> {
    this.logger.log({
      level: 'debug',
      message: 'Sending invite transaction',
      contactID,
    })
    const contact = await this.db.contacts.findOne(contactID).exec()
    if (!contact) {
      throw new Error(`Contact ${contactID} not found`)
    }
    const contactProfile = await contact.getProfile()
    if (!contactProfile.ethAddress) {
      throw new Error('No public ETH address found for Contact')
    }

    const stake = await this.invitesContract.call('requiredStake')
    const mftBalance = await this.tokenContract.getBalance(walletAddress)
    const stakeBN = utils.bigNumberify(stake)
    const balanceBN = utils.parseUnits(mftBalance, 'ether')

    if (stakeBN.gt(balanceBN)) {
      const formattedStake = utils.formatUnits(stakeBN, 'ether')
      throw new Error(
        `Insufficient MFT balance of ${balanceBN.toString()} for required stake ${formattedStake}`,
      )
    }

    try {
      const inviteTXHash = await this.processInviteTransaction(
        contactID,
        walletAddress,
      )
      const invite = {
        inviteTX: inviteTXHash,
        ethNetwork: this.ethClient.networkName,
        fromAddress: walletAddress,
        toAddress: contactProfile.ethAddress,
        stakeState: 'staked',
        stakeAmount: utils.formatUnits(stakeBN, 'ether'),
      }
      await contact.atomicSet('invite', invite)
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: 'Failed sending invite',
        error: err.toString(),
      })
      throw err
    }
  }

  async signAccepted(contactRequest: ContactRequestDoc): Promise<string> {
    const accounts = await this.user.getEthAccounts()
    const receivedAddress = accounts.find(
      a => a === contactRequest.receivedAddress,
    )
    if (!receivedAddress) {
      throw new Error(
        `Could not find a wallet containing address: ${contactRequest.receivedAddress}`,
      )
    }

    const addr = contactRequest.senderAddress.substr(2)
    const addressHash = bufferFromHex(hash(Buffer.from(addr, 'hex')))

    const messageBytes = Buffer.concat([
      Buffer.from('MFOS Contact Accept:'),
      addressHash,
    ])

    const messageHex = '0x' + messageBytes.toString('hex')
    const acceptanceSignature = await this.ethClient.signData({
      address: receivedAddress,
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

  async retrieveStake(contactID: string) {
    this.logger.log({
      level: 'debug',
      message: 'Retrieving stake for contact',
      contactID,
    })
    const contact = await this.db.contacts.findOne(contactID).exec()
    if (!contact) {
      throw new Error(`Contact ${contactID} not found`)
    }
    const txParams = await this.getRetrieveStakeParams(contact)

    const txOptions = { from: contact.invite.fromAddress }

    const res = await this.invitesContract.send(
      'retrieveStake',
      txParams,
      txOptions,
    )

    return new Promise((resolve, reject) => {
      res
        .on('hash', async () => {
          // TODO: Also set from reading contract events
          // in case reclaimed from outside of MFOS
          await contact.atomicSet('invite.stakeState', 'reclaiming')
        })
        .on('mined', async hash => {
          await contact.atomicSet('invite.stakeState', 'reclaimed')
          await contact.atomicSet('invite.reclaimedStakeTX', hash)
          resolve(hash)
        })
        .on('error', async err => {
          await contact.atomicSet('invite.stakeState', 'staked')
          reject(err)
        })
    })
  }

  async declineContactInvite(requestID: string): Promise<string> {
    const contactRequest = await this.db.contact_requests
      .findOne(requestID)
      .exec()
    if (!contactRequest) throw new Error('Invite request not found')

    this.validateInviteOriginNetwork(contactRequest.ethNetwork)
    const txParams = await this.getDeclineTXParams(contactRequest)

    const txOptions = {
      from: contactRequest.receivedAddress,
      to: this.invitesContract.address,
    }
    const res = await this.invitesContract.send(
      'declineAndWithdraw',
      txParams,
      txOptions,
    )

    return new Promise((resolve, reject) => {
      res
        .on('mined', async hash => {
          contactRequest.atomicSet('rejectedTXHash', hash)
          resolve(hash)
        })
        .on('error', err => {
          reject(err)
        })
    })
  }

  validateInviteOriginNetwork(ethNetwork: string) {
    if (ethNetwork !== this.ethClient.networkName) {
      throw new Error(
        `Please connect to the eth network (${ethNetwork}) this invite was originally sent from to withdraw this stake.`,
      )
    }
  }

  async validateNetwork() {
    await this.ethClient.fetchNetwork()
    if (!contracts[this.ethClient.networkName]) {
      throw new Error(
        `Sorry, Ethereum network "${this.ethClient.networkName}" is not supported for contact invites`,
      )
    }
    if (
      this.env.type === 'production' &&
      this.ethClient.networkName !== 'mainnet'
    ) {
      throw new Error(
        `Sorry, this feature is only available on Ethereum mainnet, you are currently running on ${this.ethClient.networkName}.`,
      )
    }
  }

  // SUBSCRIPTIONS

  async subscribeToEthEvents(userFeedHash: string) {
    try {
      if (!this.ethClient.web3Provider.on) {
        this.logger.log({
          level: 'debug',
          message: 'Subscribe to blockchain invite events',
          id: userFeedHash,
        })
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
          // Remove signature topic
          const event = this.invitesContract.decodeEventLog(name, log.result)
          handler(event)
        } catch (err) {
          this.logger.log({
            level: 'error',
            message: 'Error handling invite event',
            error: err.toString(),
          })
        }
      }
      // $FlowFixMe subscription compatibility already checked
      this.ethClient.web3Provider.on(invitesSubID, async msg => {
        handleEvent('Invited', msg, this.handleInviteEvent)
      })

      // $FlowFixMe subscription compatibility already checked
      this.ethClient.web3Provider.on(declinedSub, async msg => {
        handleEvent('Declined', msg, this.handleDeclinedEvent)
      })
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: 'Error subscribing to blockchain invite events',
        error: err.toString(),
      })
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

  async getDeclineTXParams(contactRequest: Object) {
    const peer = await contactRequest.populate('peer')
    const myFeedHash = hash(Buffer.from(this.user.getPublicID()))
    const fromAddressHash = hash(bufferFromHex(contactRequest.senderAddress))
    const fromFeedHash = hash(Buffer.from(peer.getPublicID()))
    return [fromAddressHash, fromFeedHash, myFeedHash]
  }

  async getDeclineTXDetails(requestID: string): Promise<Object> {
    const contactRequest = await this.db.contact_requests
      .findOne(requestID)
      .exec()
    if (!contactRequest) throw new Error('Invite request not found')

    this.validateInviteOriginNetwork(contactRequest.ethNetwork)
    const txParams = await this.getDeclineTXParams(contactRequest)
    const data = this.invitesContract.encodeCall('declineAndWithdraw', txParams)

    const txOptions = {
      from: contactRequest.receivedAddress,
      to: this.invitesContract.address,
      data,
    }
    const params = await this.ethClient.completeTxParams(txOptions)
    const formattedParams = await this.formatGasValues(params)
    return { ...params, ...formattedParams }
  }

  async getRetrieveStakeParams(contact: Object): Promise<Array<string>> {
    const peer = await contact.populate('peer')

    const invite = contact.invite

    if (invite != null && invite.stakeAmount && invite.acceptedSignature) {
      const sigParams = this.signatureParams(invite.acceptedSignature)

      const fromFeedHash = hash(Buffer.from(this.user.getPublicID()))
      const toAddrHash = hash(bufferFromHex(invite.toAddress))
      const toFeedHash = hash(Buffer.from(peer.getPublicID()))

      this.validateInviteOriginNetwork(invite.ethNetwork)

      return [
        toAddrHash,
        toFeedHash,
        fromFeedHash,
        sigParams.vNum,
        sigParams.r,
        sigParams.s,
      ]
    }
    throw new Error('Invalid invite state to retrieve stake')
  }

  async getRetrieveStakeTXDetails(contactID: string): Promise<Object> {
    const contact = await this.db.contacts.findOne(contactID).exec()
    if (!contact) {
      throw new Error(`Contact ${contactID} not found`)
    }
    const txParams = await this.getRetrieveStakeParams(contact)

    this.validateInviteOriginNetwork(contact.invite.ethNetwork)
    const data = this.invitesContract.encodeCall('retrieveStake', txParams)
    const txOptions = {
      from: contact.invite.fromAddress,
      to: this.invitesContract.address,
      data,
    }
    const params = await this.ethClient.completeTxParams(txOptions)
    const formattedParams = await this.formatGasValues(params)
    return { ...params, ...formattedParams }
  }

  async getApproveTXDetails(): Promise<Object> {
    this.logger.log({
      level: 'debug',
      message: 'Getting invite approve tx details',
    })
    const stake = await this.invitesContract.call('requiredStake')
    const data = this.tokenContract.encodeCall('approve', [
      this.invitesContract.address,
      stake,
    ])
    const txOptions = {
      from: this.user.profile.ethAddress,
      to: this.tokenContract.address,
      data,
    }
    const params = await this.ethClient.completeTxParams(txOptions)
    const formattedParams = await this.formatGasValues(params)
    return { ...params, ...formattedParams }
  }

  async getSendInviteTXDetails(contactID: string): Promise<Object> {
    this.logger.log({
      level: 'debug',
      message: 'Getting invite send tx details',
      contact: contactID,
    })

    const params = await this.getInviteParams(contactID)

    const data = this.invitesContract.encodeCall('sendInvite', params)
    const txOptions = {
      from: this.user.profile.ethAddress,
      to: this.invitesContract.address,
      data,
    }
    this.logger.log({
      level: 'debug',
      message: 'Formatting invite tx params',
      txOptions,
    })
    const txParams = await this.ethClient.completeTxParams(txOptions)
    const formattedParams = await this.formatGasValues(txParams)
    return { ...txParams, ...formattedParams }
  }

  async getInviteTXDetails(type: string, contactID: string) {
    await this.validateNetwork()
    if (type === 'declineInvite') {
      return this.getDeclineTXDetails(contactID)
    }
    switch (type) {
      case 'approve':
        return this.getApproveTXDetails()
      case 'sendInvite':
        return this.getSendInviteTXDetails(contactID)
      case 'retrieveStake':
        return this.getRetrieveStakeTXDetails(contactID)
      default:
        throw new Error('Unknown transaction type')
    }
  }
}
