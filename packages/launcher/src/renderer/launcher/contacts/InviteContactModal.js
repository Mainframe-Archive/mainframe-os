// @flow

import { Button, DropDown, Text, Tooltip } from '@morpheus-ui/core'
import { utils } from 'ethers'
import React, { Component } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import styled from 'styled-components/native'

import { MFT_TOKEN_ADDRESSES } from '../../../constants'

import rpc, { getEthClient } from '../rpc'
import WalletIcon from '../wallets/WalletIcon'

import Avatar from '../../UIComponents/Avatar'
import CircleCheck from '../../UIComponents/Icons/Circlecheck'
import CircleLoader from '../../UIComponents/CircleLoader'
import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'

import Transaction from './Transaction'

import type { WalletAccount, WalletAccounts } from './ContactsScreen'

import type { InviteContactModal_contactInvite as ContactInvite } from './__generated__/InviteContactModal_contactInvite.graphql'
import type { InviteContactModal_user as User } from './__generated__/InviteContactModal_user.graphql'

export type ContactInfo = {
  localID: string,
  publicID: string,
  profile: $ReadOnly<{
    name?: ?string,
    ethAddress?: ?string,
  }>,
}

export type TransactionType = 'invite' | 'retrieveStake' | 'declineInvite'

type Props = {
  closeModal: () => void,
  contactInfo: ContactInfo,
  contactInvite: ?ContactInvite,
  type: TransactionType,
  wallets: WalletAccounts,
  selectedAddress: string,
  updateSelectedAddress: string => void,
  showNotification: string => void,
  user: User,
}

export type TXParam = {
  gasPriceGwei: string,
  maxCost: string,
  stakeAmount: string,
}

type TXParams = Array<TXParam>

type State = {
  txProcessing: boolean,
  error?: ?string,
  txParams?: ?TXParams,
  declinedTXHash?: ?string,
  withdrawTXHash?: ?string,
  balances?: {
    eth: string,
    mft: string,
  },
  invitePending?: {
    error?: string,
    state:
      | 'awaiting_approval'
      | 'sending_approval'
      | 'approved'
      | 'sending_invite'
      | 'invite_sent'
      | 'error',
  },
  txScreen: boolean,
  dropdownError: boolean,
  insufficientFunds: boolean,
  contractRecipientAddress?: ?string,
}

const FormContainer = styled.View`
  margin-top: 20px;
  max-width: 450px;
  flex: 1;
  width: 100%;
  align-self: center;
  align-items: center;
  margin-top: 15vh;
`

const Section = styled.View`
  margin-bottom: 20px;
`

const AddContactDetail = styled.View`
  padding: 10px;
  margin-top: -10px;
  width: 440px;
  border-radius: 3px;
  border-color: #efefef;
  flex-direction: row;
  align-items: center;
  ${props => props.border && `border-width: 1px;`}
  ${props => props.noMarginTop && `margin-top: 0px; padding: 5px;`}
`

const DropDownContainer = styled.View`
  width: 440px;
`

const AddContactDetailText = styled.View`
  flex: 1;
  overflow: hidden;
  padding-right: 20px;
`

const Blocky = styled.View`
  margin-right: 15px;
`

class InviteContactModal extends Component<Props, State> {
  state = {}

  componentDidMount() {
    const { type } = this.props
    if (type === 'invite') {
      this.getInviteApproveTXDetails()
    } else if (type === 'declineInvite' || type === 'retrieveStake') {
      this.getTXDetails(type)
    }
    this.getBalances()
  }

  async getBalances() {
    const ethClient = getEthClient()
    // TODO: this could be queried with GraphQL
    const { ethAddress } = this.props.user.profile
    const address = MFT_TOKEN_ADDRESSES[ethClient.networkName]
    let balances = {
      mft: '0',
      eth: '0',
    }
    if (address && ethAddress) {
      const token = ethClient.erc20Contract(address)
      const [mft, eth] = await Promise.all([
        token.getBalance(ethAddress),
        ethClient.getETHBalance(ethAddress),
      ])
      balances = { mft, eth }
    }
    this.setState({ balances })
  }

  async getTXDetails(type: string) {
    try {
      const res = await rpc.getInviteTXDetails({
        type,
        contactID: this.props.contactInfo.localID,
        customAddress: this.props.selectedAddress,
      })
      this.setState({
        txParams: [res],
        error: null,
      })
    } catch (err) {
      this.setState({
        error: err.message,
      })
    }
  }

  async getInviteApproveTXDetails(address?: string) {
    try {
      const res = await rpc.getInviteTXDetails({
        type: 'approve',
        contactID: this.props.contactInfo.localID,
        customAddress: address ? address : this.props.selectedAddress,
      })
      this.setState({
        txParams: [res],
        invitePending: {
          state: 'awaiting_approval',
        },
        error: null,
      })
    } catch (err) {
      this.setState({
        error: err.message,
      })
    }
  }

  async getInviteSendTXDetails() {
    try {
      const res = await rpc.getInviteTXDetails({
        type: 'sendInvite',
        contactID: this.props.contactInfo.localID,
        customAddress: this.props.selectedAddress,
      })
      this.setState(prevState => {
        if (prevState.txParams) {
          const [previousTxParams] = prevState.txParams
          return {
            txParams: [previousTxParams, res],
            invitePending: {
              state: 'approved',
            },
            error: null,
          }
        }
      })
    } catch (err) {
      this.setState({
        error: err.message,
        invitePending: {
          state: 'error',
        },
      })
    }
  }

  sendApproveTX = async () => {
    try {
      this.setState({ txProcessing: true, error: null })
      await rpc.sendInviteApprovalTX({
        contactID: this.props.contactInfo.localID,
        customAddress: this.props.selectedAddress,
      })
      this.setState({
        txProcessing: false,
        invitePending: {
          state: 'approved',
        },
      })
      this.getInviteSendTXDetails()
    } catch (err) {
      this.setState({
        error: err.message,
        txProcessing: false,
        invitePending: {
          state: 'error',
        },
      })
    }
  }

  sendInvite = async () => {
    try {
      this.setState({ txProcessing: true, error: null })
      await rpc.sendInviteTX({
        contactID: this.props.contactInfo.localID,
        customAddress: this.props.selectedAddress,
      })
      this.setState({
        invitePending: {
          state: 'invite_sent',
        },
      })
      this.props.closeModal()
    } catch (err) {
      this.setState({
        error: err.message,
        txProcessing: false,
        invitePending: {
          state: 'approved',
        },
      })
    }
  }

  sendDeclineTX = async () => {
    try {
      this.setState({ txProcessing: true, error: null })
      const res = await rpc.sendDeclineInviteTX({
        requestID: this.props.contactInfo.localID,
      })
      this.setState({
        txProcessing: false,
        declinedTXHash: res,
      })
      this.props.closeModal()
      this.props.showNotification('decline')
    } catch (err) {
      this.setState({
        txProcessing: false,
        error: err.message,
      })
    }
  }

  withdrawStake = async () => {
    try {
      this.setState({ txProcessing: true, error: null })
      const res = await rpc.sendWithdrawInviteTX({
        contactID: this.props.contactInfo.localID,
      })
      this.setState({
        txProcessing: false,
        withdrawTXHash: res,
      })
      this.props.closeModal()
      this.props.showNotification('withdraw')
    } catch (err) {
      this.setState({
        txProcessing: false,
        error: err.message,
      })
    }
  }

  validate = feedback => {
    const { user, wallets } = this.props
    const addr = feedback.value
    const wallet = addr && addr.length > 0 ? wallets[addr] : null

    if (wallet == null) {
      this.setState({ dropdownError: true })
      return 'Wallet not found'
    }

    const { eth, mft } = wallet.balances

    if (this.props.type === 'invite') {
      if (mft.lt(utils.parseEther(user.contactInviteStake))) {
        this.setState({ dropdownError: true })
        return 'Insufficient MFT funds in this wallet'
      } else if (eth.isZero()) {
        this.setState({ dropdownError: true })
        return 'Insufficient ETH funds in this wallet'
      } else {
        this.setState({ dropdownError: false })
      }
    } else {
      if (!(Number(eth) > 0)) {
        this.setState({ dropdownError: true })
        return 'Insufficient ETH funds in this wallet'
      } else {
        this.setState({ dropdownError: false })
      }
    }
  }

  showTransactions = () => {
    this.setState({ txScreen: true })
  }

  updateSelectedAddress = (addr: string) => {
    // refresh tx details
    if (this.props.type === 'invite') {
      this.getInviteApproveTXDetails(addr)
    }
    this.props.updateSelectedAddress(addr)
  }

  getApproveButton = () => {
    const { invitePending, txProcessing } = this.state

    if (invitePending && invitePending.state === 'awaiting_approval') {
      if (txProcessing) {
        return <CircleLoader width={24} height={24} key="c1" />
      } else {
        return (
          <Button
            title="APPROVE"
            variant={['small', 'red']}
            onPress={this.sendApproveTX}
            key="b1"
          />
        )
      }
    } else if (invitePending && invitePending.state === 'approved') {
      return <CircleCheck width={24} height={24} color="#00a7e7" key="c2" />
    } else {
      return null
    }
  }

  // RENDER
  renderGasData() {
    const { txParams } = this.state
    if (txParams && txParams[0]) {
      const { gasPriceGwei, maxCost, stakeAmount } = txParams[0]
      const gasLabel = `Gas price: ${gasPriceGwei}`
      const costlabel = `Max Cost: ${maxCost} ETH`
      const mftLabel = `Stake: ${stakeAmount} MFT`

      return (
        <Text color="#303030" variant={['marginTop10', 'ellipsis']} size={11}>
          {`${gasLabel}, ${costlabel}, ${mftLabel}`}
          <Tooltip top>
            <Text variant="tooltipTitle">What is gas?</Text>
            <Text variant="tooltipText">
              When you send tokens, interact with a contract, or do anything
              else on the blockchain, you must pay for that computation. That
              payment is calculated in gas, and gas is always paid in ETH. GWei
              is a measure of ETH. 1 Ether = 1,000,000,000 Gwei (10^9).
            </Text>
            <Text variant="tooltipTitle">
              {"What's "}the difference between Gas Price and Max Cost?
            </Text>
            <Text variant="tooltipText">
              Gas Price is the cost per computation. A complete transaction may
              have several computations. Max Cost = estimated number of
              computation required to complete the transaction * Gas Price. You
              are guaranteed not to pay more than this. It will likely actually
              be less.
            </Text>
          </Tooltip>
        </Text>
      )
    }
  }

  renderContactSection(title: string) {
    const { contactInfo } = this.props

    return (
      <Section>
        <Text
          bold
          variant="smallTitle"
          color="#585858"
          theme={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {title}{' '}
        </Text>
        <AddContactDetail border>
          <Blocky>
            <Avatar id={contactInfo.publicID} size="small" />
          </Blocky>
          <AddContactDetailText>
            <Text bold variant="greyDark23" size={13}>
              {contactInfo.profile.name || 'This user has a private profile'}
            </Text>
            <Text variant={['greyDark23', 'ellipsis']} size={12}>
              {contactInfo.publicID}
            </Text>
            <Text variant={['greyDark23', 'ellipsis']} size={12}>
              {contactInfo.profile.ethAddress}
            </Text>
          </AddContactDetailText>
        </AddContactDetail>
      </Section>
    )
  }

  renderTransactionSection(title: string) {
    const { type, wallets } = this.props

    const titleSection = (
      <Text
        bold
        variant="smallTitle"
        color="#585858"
        theme={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {title}{' '}
        {type === 'declineInvite' && (
          <Tooltip>
            <Text variant="tooltipTitle">
              Where did this address come from?
            </Text>
            <Text variant="tooltipText">
              This is/was your default address at the time this contact sent the
              blockchain invite.
            </Text>
          </Tooltip>
        )}
        {type === 'retrieveStake' && (
          <Tooltip>
            <Text variant="tooltipTitle">
              Where did this address come from?
            </Text>
            <Text variant="tooltipText">
              This is the address you chose to stake MFT from at the time the
              blockchain invite was sent.
            </Text>
          </Tooltip>
        )}
      </Text>
    )

    if (type === 'invite') {
      const walletsArray = Object.values(wallets)
      if (walletsArray.length !== 0) {
        // $FlowFixMe: Object.values() losing type
        const options = walletsArray.map((wallet: WalletAccount) => {
          return {
            key: wallet.address,
            data: (
              <AddContactDetail noMarginTop>
                <Blocky>
                  <WalletIcon address={wallet.address} size="small" />
                </Blocky>
                <AddContactDetailText>
                  <Text variant={['greyDark23', 'ellipsis', 'mono']} size={12}>
                    {wallet.address}
                  </Text>
                  <Text variant="greyDark23" size={11}>{`MFT: ${
                    wallet.balances.mft
                  }, ETH: ${wallet.balances.eth}`}</Text>
                </AddContactDetailText>
              </AddContactDetail>
            ),
          }
        })

        return (
          <Section>
            {titleSection}
            <DropDownContainer>
              <DropDown
                options={options}
                valueKey="key"
                displayKey="data"
                name="walletDropdown"
                defaultValue={this.props.selectedAddress}
                onChange={addr => {
                  this.updateSelectedAddress(addr)
                }}
                variant={[
                  this.state.dropdownError ? 'error' : '',
                  'maxWidth440',
                ]}
                validation={feedback => this.validate(feedback)}
                disabled={this.state.txProcessing}
              />
            </DropDownContainer>
            {this.renderGasData()}
          </Section>
        )
      }
    } else {
      const address = this.props.selectedAddress
      const wallet = wallets[address]
      return (
        <Section>
          {titleSection}
          <AddContactDetail border>
            <Blocky>
              <WalletIcon address={address} size="small" />
            </Blocky>
            <AddContactDetailText>
              <Text variant={['greyDark23', 'ellipsis', 'mono']} size={12}>
                {address}
              </Text>
              <Text
                variant="greyDark23"
                size={11}>{`MFT: ${wallet.balances.mft.toString(
                10,
              )}, ETH: ${wallet.balances.eth.toString(10)}`}</Text>
            </AddContactDetailText>
          </AddContactDetail>
          {this.renderGasData()}
        </Section>
      )
    }
  }

  renderInviteTransactions() {
    const { invitePending, txProcessing, txParams } = this.state
    const approveInfo = {
      title: 'TRANSACTION 1/2',
      question: 'What does this mean?',
      answer:
        'To send an invite you must first grant approval to the contract to use your tokens.',
    }
    const sendInfo = {
      title: 'TRANSACTION 2/2',
      question: 'What does this mean?',
      answer: 'This transaction will send the invite and withdraw your MFT.',
    }

    const approveButton = this.getApproveButton()
    const sendButton = txProcessing ? (
      <CircleLoader width={24} height={24} key="c3" />
    ) : (
      <Button
        title="APPROVE"
        variant={['small', 'red']}
        onPress={this.sendInvite}
        key="b2"
      />
    )

    return (
      <Section>
        <Transaction
          title="Contract"
          tooltipInfo={approveInfo}
          txParam={txParams && txParams[0]}
          button={approveButton}
        />
        {invitePending && invitePending.state === 'approved' && (
          <Transaction
            title="Staking"
            tooltipInfo={sendInfo}
            txParam={txParams && txParams[0]}
            button={sendButton}
          />
        )}
      </Section>
    )
  }

  renderRetrieveStake() {
    const { contactInvite, user } = this.props
    const activity = this.state.txProcessing && <Loader />
    const reclaimedTX =
      contactInvite && contactInvite.reclaimedStakeTX ? (
        <Text>TX hash: {contactInvite.reclaimedStakeTX}</Text>
      ) : null

    return (
      <>
        {this.renderContactSection('YOUR INVITATION HAS BEEN ACCEPTED FROM')}
        {this.renderTransactionSection(
          `WITHDRAW YOUR ${user.contactInviteStake} MFT ON`,
        )}
        {reclaimedTX}
        {activity}
      </>
    )
  }

  renderDeclineInvite() {
    const activity = this.state.txProcessing && <Loader />
    const declinedTXHash = this.state.declinedTXHash ? (
      <Text>TX hash: {this.state.declinedTXHash}</Text>
    ) : null
    return (
      <>
        {this.renderContactSection('DECLINE INVITATION FROM')}
        {this.renderTransactionSection(
          `CLAIM ${this.props.user.contactInviteStake} MFT ON`,
        )}
        {declinedTXHash}
        {activity}
      </>
    )
  }

  renderInvite() {
    const activity = this.state.txProcessing && <Loader />

    if (this.state.txScreen) {
      return this.renderInviteTransactions()
    } else {
      return (
        <>
          {this.renderContactSection('SEND BLOCKCHAIN INVITATION TO')}
          {this.renderTransactionSection(
            `APPROVE AND STAKE ${this.props.user.contactInviteStake} MFT FROM`,
          )}
          {activity}
        </>
      )
    }
  }

  render() {
    let content
    let btnTitle
    let action
    let screenTitle
    switch (this.props.type) {
      case 'invite':
        content = this.renderInvite()
        screenTitle = 'ADD A NEW CONTACT'
        if (!this.state.txScreen) {
          action = this.showTransactions
          btnTitle = 'INVITE'
        } else if (
          this.state.invitePending &&
          this.state.invitePending.state === 'invite_sent'
        ) {
          action = this.props.closeModal
          btnTitle = 'DONE'
        }
        break
      case 'retrieveStake':
        content = this.renderRetrieveStake()
        screenTitle = 'WITHDRAW YOUR MFT'
        if (!this.state.txProcessing) {
          if (this.state.withdrawTXHash) {
            action = this.props.closeModal
            btnTitle = 'DONE'
          } else {
            action = this.withdrawStake
            btnTitle = 'WITHDRAW'
          }
        }
        break
      case 'declineInvite':
        content = this.renderDeclineInvite()
        screenTitle = 'DECLINE AND CLAIM MFT'
        if (!this.state.txProcessing) {
          if (this.state.declinedTXHash) {
            action = this.props.closeModal
            btnTitle = 'DONE'
          } else {
            action = this.sendDeclineTX
            btnTitle = 'DECLINE / CLAIM'
          }
        }
        break
      default:
    }

    const error = this.state.error && (
      <Text variant={['error']} numberOfLines={2}>
        {this.state.error}
      </Text>
    )
    const render = (
      <>
        {content}
        {error}
      </>
    )

    return (
      <FormModalView
        title={screenTitle}
        confirmButton={btnTitle}
        dismissButton="CANCEL"
        onRequestClose={this.props.closeModal}
        onSubmitForm={action}>
        <FormContainer modal>{render}</FormContainer>
      </FormModalView>
    )
  }
}

export default createFragmentContainer(InviteContactModal, {
  contactInvite: graphql`
    fragment InviteContactModal_contactInvite on ContactInvite {
      ethNetwork
      fromAddress
      inviteTX
      stakeState
      stakeAmount
      reclaimedStakeTX
    }
  `,
  user: graphql`
    fragment InviteContactModal_user on User {
      contactInviteStake
      profile {
        ethAddress
      }
    }
  `,
})
