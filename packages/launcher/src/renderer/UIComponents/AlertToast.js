//@flow

import React, { Component } from 'react'
import ReactModal from 'react-modal'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Text } from '@morpheus-ui/core'
import styled from 'styled-components/native'
import CloseIcon from '@morpheus-ui/icons/Close'

type Props = {
  message?: ?string,
  onRequestClose?: () => void,
}

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 11px;
  right: 11px;
  width: 24px;
  height: 24px;
  z-index: 1;
  align-items: center;
  justify-content: center;
`

const Message = styled.View`
  position: fixed;
  top: 16px;
  right: 16px;
  background-color: #303030d1;
  padding: 15px 55px 15px 15px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  min-height: 40px;
`

export default class ModalView extends Component<Props> {
  render() {
    const closeButton = this.props.onRequestClose ? (
      <CloseButton onPress={this.props.onRequestClose}>
        <CloseIcon color="#C0C0C0" width={13} height={16} />
      </CloseButton>
    ) : null

    return (
      <ReactModal
        overlayClassName="alert-modal"
        isOpen={true}
        onRequestClose={this.props.onRequestClose}>
        <ReactCSSTransitionGroup
          transitionName="alert-toast"
          transitionEnterTimeout={100}
          transitionLeaveTimeout={300}>
          {this.props.message ? (
            <Message className="transition" visible={this.props.message}>
              <Text bold color="white" size={13}>
                {this.props.message}
              </Text>
              {closeButton}
            </Message>
          ) : null}
        </ReactCSSTransitionGroup>
      </ReactModal>
    )
  }
}
