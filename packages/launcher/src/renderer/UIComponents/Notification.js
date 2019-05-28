//@flow

import React, { Component, type Node } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components/native'
import CloseIcon from '@morpheus-ui/icons/Close'

type Props = {
  onRequestClose?: () => void,
  children?: ?Node,
}

const ChildrenContainer = styled.View`
  padding: 10px 20px;
`

const InternalModal = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 90px;
  width: 384px;
  background-color: rgba(48, 48, 48, 0.85);
  border-radius: 3px;
`

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 12px;
  height: 12px;
  z-index: 1;
  align-items: center;
  justify-content: center;
`

export default class ModalView extends Component<Props> {
  render() {
    const closeButton = (
      <CloseButton onPress={this.props.onRequestClose}>
        <CloseIcon color="#c0c0c0" width={12} height={12} />
      </CloseButton>
    )

    return (
      <ReactModal
        isOpen={true}
        onRequestClose={this.props.onRequestClose}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0)' },
          content: {},
        }}>
        <InternalModal>
          {closeButton}
          <ChildrenContainer>{this.props.children}</ChildrenContainer>
        </InternalModal>
      </ReactModal>
    )
  }
}
