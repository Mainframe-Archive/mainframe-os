//@flow
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Text } from '@morpheus-ui/core'
import { graphql, createFragmentContainer } from 'react-relay'
import Loader from '../../UIComponents/Loader'

import rpc from '../rpc'
import { type CurrentUser } from '../LauncherContext'
import FormModalView from '../../UIComponents/FormModalView'

import type { InviteContactModal_contact as Contact } from './__generated__/InviteContactModal_contact.graphql.js'

type Props = {
  closeModal: () => void,
  user: CurrentUser,
  contact: Contact,
}

type State = {
  txProcessing: boolean,
  error?: ?string,
  invitePending?: {
    error?: string,
    state:
      | 'awaiting_approval'
      | 'sending_approval'
      | 'approved'
      | 'sending_invite'
      | 'invite_sent'
      | 'error',
    txParams?: {
      gasPriceGwei: string,
      maxCost: string,
      stakeAmount: string,
    },
  },
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

export class InviteContactModal extends Component<Props, State> {
  state = {}

  componentDidMount() {
    this.getInviteApproveTXDetails()
  }

  async getInviteApproveTXDetails() {
    const { user, contact } = this.props
    try {
      const res = await rpc.getInviteTXDetails({
        type: 'approve',
        userID: user.localID,
        contactID: contact.localID,
      })
      this.setState({
        invitePending: {
          state: 'awaiting_approval',
          txParams: res,
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
        invitePending: {
          state: 'approved',
          txProcessing: false,
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
      })
      this.props.closeModal()
    } catch (err) {
      this.setState({
        error: err.message,
        invitePending: {
          state: 'approved',
          txProcessing: false,
        },
      })
    }
  }

  // RENDER

  renderGasData() {
    const { invitePending } = this.state
    if (invitePending && invitePending.txParams) {
      const { gasPriceGwei, maxCost, stakeAmount } = invitePending.txParams
      const gasLabel = `Gas price: ${gasPriceGwei}`
      const costlabel = `Max Cost: ${maxCost} ETH`
      const mftLabel = `Stake: ${stakeAmount} MFT`
      return (
        <Text variant={['small']}>
          {`${gasLabel}, ${costlabel}, ${mftLabel}`}
        </Text>
      )
    }
  }

  renderContent() {
    const activity = this.state.txProcessing && <Loader />
    const error = this.state.error && (
      <Text variant={['error']}>{this.state.error}</Text>
    )

    return (
      <>
        <Section>
          <Text variant={['smallTitle', 'bold']}>
            SEND BLOCKCHAIN INVITATION TO
          </Text>
          <Text>{this.props.contact.profile.name}</Text>
          <Text>{this.props.contact.profile.ethAddress}</Text>
        </Section>
        <Section>
          <Text variant={['smallTitle', 'bold']}>
            {`APPROVE AND SEND 10 MFT FROM`}
          </Text>
          <Text>{this.props.user.profile.ethAddress}</Text>
          {this.renderGasData()}
        </Section>
        {activity}
        {error}
      </>
    )
  }

  render() {
    let action
    let title
    const { invitePending } = this.state
    if (!this.state.txProcessing) {
      if (invitePending && invitePending.state === 'awaiting_approval') {
        action = this.sendApproveTX
        title = 'Approve Invite'
      } else if (invitePending && invitePending.state === 'approved') {
        action = this.sendInvite
        title = 'Send Invite'
      }
    }

    return (
      <FormModalView
        title="SEND BLOCKCHAIN INVITATION"
        confirmButton={title}
        dismissButton="CANCEL"
        onRequestClose={this.props.closeModal}
        onSubmitForm={action}>
        <FormContainer modal>{this.renderContent()}</FormContainer>
      </FormModalView>
    )
  }
}

export default createFragmentContainer(InviteContactModal, {
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
})
