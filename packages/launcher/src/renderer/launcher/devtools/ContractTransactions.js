import { Button, DropDown, Text, Tooltip } from '@morpheus-ui/core'
import { utils } from 'ethers'
import React, { Component } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import styled from 'styled-components/native'

import { MFT_TOKEN_ADDRESSES } from '../../../constants'

import rpc, { ethClient } from '../rpc'
import WalletIcon from '../wallets/WalletIcon'

import Avatar from '../../UIComponents/Avatar'
import CircleCheck from '../../UIComponents/Icons/Circlecheck'
import CircleLoader from '../../UIComponents/CircleLoader'
import FormModalView from '../../UIComponents/FormModalView'
import Loader from '../../UIComponents/Loader'

import Transaction from './Transaction'

import type { WalletAccount, WalletAccounts } from './ContactsScreen'

export default class SetPermissionsRequirements extends Component<> {
  this.state = {txStatus: 'start'}

componentDidMount(){
  this.getTxDetails()
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

  async getTXDetails() {
    try {
      const res = await rpc.getInviteTXDetails()
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

  render() {
    const { txStatus, txProcessing, txParams } = this.state
    const approveInfo = {
      title: 'TRANSACTION 1/2',
      question: 'What does this mean?',
      answer:
        'To submit your app you must first grant approval to the contract to use your tokens.',
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
      <FormModalView
        title="Submit to dapp store"
        dismissButton={this.props.onPressBack ? 'BACK' : 'CANCEL'}
        onPressDismiss={this.props.onPressBack}
        confirmTestID="set-permission-requirements"
        confirmButton="NEXT"
        onPressConfirm={this.onPressSave}
        onRequestClose={this.props.onRequestClose}>
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
      </FormModalView>
    )
  }
}
