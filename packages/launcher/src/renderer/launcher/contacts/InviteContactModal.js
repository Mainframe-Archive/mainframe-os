//@flow
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text, Tooltip, DropDown, Button, TextField } from '@morpheus-ui/core'
import { Form } from '@morpheus-ui/forms'

import { graphql, createFragmentContainer } from 'react-relay'
import { filter } from 'lodash'
import CircleCheck from '../../UIComponents/Icons/Circlecheck'
import Loader from '../../UIComponents/Loader'
import CircleLoader from '../../UIComponents/CircleLoader'

import rpc from '../rpc'
import FormModalView from '../../UIComponents/FormModalView'
import Avatar from '../../UIComponents/Avatar'
import WalletIcon from '../wallets/WalletIcon'

import applyContext, { type ContextProps } from '../LauncherContext'
import { MFT_TOKEN_ADDRESSES } from '../../../constants'

import type { InviteContactModal_contact as Contact } from './__generated__/InviteContactModal_contact.graphql.js'
import type { WalletAccounts } from './ContactsView'

export type TransactionType = 'invite' | 'retrieveStake' | 'declineInvite'

type Props = ContextProps & {
  closeModal: () => void,
  contact: Contact,
  type: TransactionType,
  inviteStakeValue: ?number,
  wallets: WalletAccounts,
}

type TXParams = {
  gasPriceGwei: string,
  maxCost: string,
  stakeAmount: string,
}

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
  selectedAddress: ?string,
  dropdownError: boolean,
  insufficientFunds: boolean,
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
  ${props => props.maxHeight && `max-height: 46px;`}
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

const GasContainer = styled.View`
  display: flex;
  max-width: 100%;
  flex-direction: row;
`

const TitleTooltipContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  ${props => props.paddingTop && `padding-top: 30px;`}
`

class InviteContactModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const { user } = this.props
    this.state = {
      txProcessing: false,
      // selectedAddress: user.profile.ethAddress,
      insufficientFunds: false,
      txScreen: false,
      dropdownError: false,
    }
  }

  componentDidMount() {
    if (this.props.type === 'invite') {
      this.getInviteApproveTXDetails()
    } else {
      this.getTXDetails(this.props.type)
    }
    this.getBalances()

    //initial check for sufficient funds
    const mft = filter(
      this.props.wallets,
      w => w.address === this.props.selectedAddress,
    )[0].balances.mft
    if (Number(mft) < this.props.inviteStakeValue) {
      this.setState({ insufficientFunds: true })
    } else {
      this.setState({ insufficientFunds: false })
    }
  }

  async getBalances() {
    const { ethAddress } = this.props.user.profile
    const address = MFT_TOKEN_ADDRESSES[this.props.ethClient.networkName]
    let balances = {
      mft: '0',
      eth: '0',
    }
    if (address && ethAddress) {
      const token = this.props.ethClient.erc20Contract(address)
      const [mft, eth] = await Promise.all([
        token.getBalance(ethAddress),
        this.props.ethClient.getETHBalance(ethAddress),
      ])
      balances = { mft, eth }
    }
    this.setState({ balances })
  }

  async getTXDetails(type: string) {
    const { user, contact } = this.props
    try {
      const res = await rpc.getInviteTXDetails({
        type: type,
        userID: user.localID,
        contactID: contact.localID,
        customAddress: this.props.selectedAddress,
      })
      console.log(res)
      this.setState({
        txParams: res,
      })
    } catch (err) {
      this.setState({
        error: err.message,
      })
    }
  }

  async getInviteApproveTXDetails() {
    const { user, contact } = this.props

    try {
      const res = await rpc.getInviteTXDetails({
        type: 'approve',
        userID: user.localID,
        contactID: contact.localID,
        customAddress: this.props.selectedAddress,
      })
      this.setState({
        txParams: res,
        invitePending: {
          state: 'awaiting_approval',
        },
      })
    } catch (err) {
      this.setState({
        error: err.message,
      })
    }
  }

  async getInviteSendTXDetails() {
    const { user, contact } = this.props
    try {
      const res = await rpc.getInviteTXDetails({
        type: 'sendInvite',
        userID: user.localID,
        contactID: contact.localID,
        customAddress: this.props.selectedAddress,
      })
      this.setState({
        invitePending: {
          state: 'approved',
          txParams: res,
        },
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
    const { user, contact } = this.props
    try {
      this.setState({ txProcessing: true, error: null })
      await rpc.sendInviteApprovalTX({
        userID: user.localID,
        contactID: contact.localID,
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
    const { user, contact } = this.props
    try {
      this.setState({ txProcessing: true, error: null })
      await rpc.sendInviteTX({
        userID: user.localID,
        contactID: contact.localID,
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
    const { user, contact } = this.props
    try {
      this.setState({ txProcessing: true, error: null })
      const res = await rpc.sendDeclineInviteTX({
        userID: user.localID,
        peerID: contact.localID,
        customAddress: this.props.selectedAddress,
      })
      this.setState({
        txProcessing: false,
        declinedTXHash: res,
      })
      this.props.closeModal()
      this.props.showNotification('decline', this.props.selectedAddress)
    } catch (err) {
      this.setState({
        txProcessing: false,
        error: err.message,
      })
    }
  }

  withdrawStake = async () => {
    const { user, contact } = this.props
    try {
      this.setState({ txProcessing: true, error: null })
      const res = await rpc.sendWithdrawInviteTX({
        userID: user.localID,
        contactID: contact.localID,
        customAddress: this.props.selectedAddress,
      })
      this.setState({
        txProcessing: false,
        withdrawTXHash: res,
      })
      this.props.closeModal()
      this.props.showNotification('withdraw', this.props.selectedAddress)
    } catch (err) {
      this.setState({
        txProcessing: false,
        error: err.message,
      })
    }
  }

  validateBalance = feedback => {
    const addr = feedback.value
    const mft = filter(this.props.wallets, w => w.address === addr)[0].balances
      .mft
    const eth = filter(this.props.wallets, w => w.address === addr)[0].balances
      .eth
    if (Number(mft) < this.props.inviteStakeValue) {
      this.setState({ dropdownError: true })
      return 'Insufficient MFT funds in this wallet'
    } else if (!(Number(eth) > 0)) {
      this.setState({ dropdownError: true })
      return 'Insufficient ETH funds in this wallet'
    } else {
      this.setState({ dropdownError: false })
      // this.props.updatedSelectedAddress(addr)
    }
  }

  setAddress = feedback => {
    const selectedAddress = feedback.value
    // STOPPED HERE
    // this.props.updatedSelectedAddress(addr)
  }

  showTransactions = () => {
    this.setState({ txScreen: true })
  }

  // RENDER
  renderGasData() {
    const { txParams } = this.state
    console.log(txParams)
    if (txParams) {
      const { gasPriceGwei, maxCost, stakeAmount } = txParams
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
            <Avatar id={this.props.contact.publicFeed} size="small" />
          </Blocky>
          <AddContactDetailText>
            <Text bold variant="greyDark23" size={13}>
              {this.props.contact.profile.name ||
                'This user has a private profile'}
            </Text>
            <Text variant={['greyDark23', 'ellipsis']} size={12}>
              {this.props.contact.publicFeed}
            </Text>
            <Text variant={['greyDark23', 'ellipsis']} size={12}>
              {this.props.contact.profile.ethAddress}
            </Text>
          </AddContactDetailText>
        </AddContactDetail>
      </Section>
    )
  }

  renderTransactionSection(title: string, validate: boolean) {
    const { balances } = this.state
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
      </Text>
    )

    const options = this.props.wallets.map(w => {
      return {
        key: w.address,
        data: (
          <AddContactDetail noMarginTop>
            <Blocky>
              <WalletIcon address={w.address} size="small" />
            </Blocky>
            <AddContactDetailText>
              <Text variant={['greyDark23', 'ellipsis', 'mono']} size={12}>
                {w.address}
              </Text>
              <Text variant="greyDark23" size={11}>{`MFT: ${
                w.balances.mft
              }, ETH: ${w.balances.eth}`}</Text>
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
            onChange={this.props.updateSelectedAddress}
            variant={[this.state.dropdownError ? 'error' : '', 'maxWidth440']}
            validation={
              this.state.invitePending &&
              validate &&
              (feedback => this.validateBalance(feedback))
            }
          />
        </DropDownContainer>
        {this.renderGasData()}
      </Section>
    )
  }

  getButtonStatus = (firstAction, secondAction) => {
    const { invitePending, txProcessing } = this.state

    if (invitePending && invitePending.state === 'awaiting_approval') {
      if (txProcessing) {
        return [<CircleLoader width={24} height={24} />, <></>]
      } else {
        return [
          <Button
            title="APPROVE"
            variant={['small', 'red']}
            onPress={firstAction}
          />,
          <></>,
        ]
      }
    } else if (invitePending && invitePending.state === 'approved') {
      if (txProcessing) {
        return [
          <CircleCheck width={24} height={24} color="#00a7e7" />,
          <CircleLoader width={24} height={24} />,
        ]
      } else {
        return [
          <CircleCheck width={24} height={24} color="#00a7e7" />,
          <Button
            title="APPROVE"
            variant={['small', 'red']}
            onPress={secondAction}
          />,
        ]
      }
    } else if (invitePending && invitePending.state === 'invite_sent') {
      return [
        <CircleCheck width={24} height={24} color="#00a7e7" />,
        <CircleCheck width={24} height={24} color="#00a7e7" />,
      ]
    }
  }

  renderInviteTransactions() {
    const { balances, invitePending, txParams } = this.state
    const buttons = this.getButtonStatus(this.sendApproveTX, this.sendInvite)

    return (
      <Section>
        <TitleTooltipContainer>
          <Text variant="smallTitle">{'TRANSACTION 1/2'}</Text>
          <Tooltip>
            <Text variant="tooltipTitle">What does this mean?</Text>
            <Text variant="tooltipText">
              To send an invite you must first grant approval to the contract to
              use your tokens.
            </Text>
          </Tooltip>
        </TitleTooltipContainer>
        <AddContactDetail border maxHeight>
          <AddContactDetailText>
            <Text variant={['greyDark23', 'bold']} size={12}>
              {'Contract'}
            </Text>
            {txParams && (
              <GasContainer>
                <Text color="#303030" size={11} variant="marginRight15">
                  {'Gas price: ' + txParams.gasPriceGwei}
                </Text>
                <Text color="#303030" size={11}>
                  {'Max Cost: ' + txParams.maxCost + ' ETH'}
                </Text>
              </GasContainer>
            )}
          </AddContactDetailText>
          {buttons && buttons[0]}
        </AddContactDetail>
        {invitePending && invitePending.state === 'approved' && (
          <>
            <TitleTooltipContainer paddingTop>
              <Text variant="smallTitle">{'TRANSACTION 2/2'}</Text>
              <Tooltip>
                <Text variant="tooltipTitle">What is this?</Text>
                <Text variant="tooltipText">
                  This transaction will actually stake the MFT by calling the
                  contract.
                </Text>
              </Tooltip>
            </TitleTooltipContainer>
            <AddContactDetail border maxHeight>
              <AddContactDetailText>
                <Text variant={['greyDark23', 'bold']} size={12}>
                  {'Staking'}
                </Text>
                {txParams && (
                  <GasContainer>
                    <Text color="#303030" size={11} variant="marginRight10">
                      {'Gas price: ' + txParams.gasPriceGwei}
                    </Text>
                    <Text color="#303030" size={11} variant="marginRight10">
                      {'Max Cost: ' + txParams.maxCost + ' ETH'}
                    </Text>
                    <Text color="#303030" size={11}>
                      {'Stake: ' + txParams.stakeAmount + ' MFT'}
                    </Text>
                  </GasContainer>
                )}
              </AddContactDetailText>
              {buttons && buttons[1]}
            </AddContactDetail>
          </>
        )}
      </Section>
    )
  }

  renderRetrieveStake() {
    const { invite } = this.props.contact
    const activity = this.state.txProcessing && <Loader />
    const reclaimedTX =
      invite && invite.stake && invite.stake.reclaimedTX ? (
        <Text>TX hash: {invite.stake.reclaimedTX}</Text>
      ) : null
    const amount = this.props.inviteStakeValue || ''

    return (
      <>
        {this.renderContactSection('YOUR INVITATION HAS BEEN ACCEPTED FROM')}
        {this.renderTransactionSection(`WITHDRAW YOUR ${amount} MFT ON`, true)}
        {reclaimedTX}
        {activity}
      </>
    )
  }

  renderDeclineInvite() {
    const activity = this.state.txProcessing && <Loader />
    const amount = this.props.inviteStakeValue || ''
    const declinedTXHash = this.state.declinedTXHash ? (
      <Text>TX hash: {this.state.declinedTXHash}</Text>
    ) : null
    return (
      <>
        {this.renderContactSection('DECLINE INVITATION FROM')}
        {this.renderTransactionSection('CLAIM ' + amount + ' MFT ON')}
        {declinedTXHash}
        {activity}
      </>
    )
  }

  renderInvite() {
    const activity = this.state.txProcessing && <Loader />
    const amount = this.props.inviteStakeValue || ''

    if (!this.state.txScreen) {
      return (
        <>
          {this.renderContactSection('SEND BLOCKCHAIN INVITATION TO')}
          {this.renderTransactionSection(
            `APPROVE AND STAKE ${amount} MFT FROM`,
            true,
          )}
          {activity}
        </>
      )
    } else {
      return this.renderInviteTransactions()
    }
  }

  render() {
    const { invitePending } = this.state
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
        noButtons={this.state.txScreen}
        onSubmitForm={action}>
        <FormContainer modal>{render}</FormContainer>
      </FormModalView>
    )
  }
}

const InviteContactRelayContainer = createFragmentContainer(
  InviteContactModal,
  {
    contact: graphql`
      fragment InviteContactModal_contact on Contact {
        peerID
        localID
        connectionState
        publicFeed
        invite {
          inviteTX
          stake {
            reclaimedTX
            amount
            state
          }
        }
        profile {
          name
          ethAddress
        }
      }
    `,
  },
)

export default applyContext(InviteContactRelayContainer)
