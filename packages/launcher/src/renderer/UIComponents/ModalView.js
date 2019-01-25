//@flow

import React, { Component, type Node } from 'react'
import ReactModal from 'react-modal'
import { Text } from '@morpheus-ui/core'
import styled from 'styled-components/native'
import CloseIcon from '@morpheus-ui/icons/Close'

type Props = {
  title?: string,
  onRequestClose?: () => void,
  children?: ?Node,
}

const ChildrenContainer = styled.View`
  min-width: 500px;
  min-height: 400px;
  justify-content: center;
  align-items: center;
  flex: 1;
`

const InternalModal = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
`

const ModalTitle = styled.View`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #f5f5f5;
  height: 35px;
  margin-top: 15px;
  align-items: center;
  justify-content: flex-start;
`

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  top: 0;
  width: 24px;
  height: 24px;
  z-index: 1;
`

export default class ModalView extends Component<Props> {
  render() {
    const closeButton = this.props.onRequestClose ? (
      <CloseButton onPress={this.props.onRequestClose}>
        <CloseIcon color="#808080" width={12} height={12} />
      </CloseButton>
    ) : null
    return (
      <ReactModal isOpen={true} onRequestClose={this.props.onRequestClose}>
        <InternalModal>
          <ModalTitle>
            <Text variant={['smallTitle', 'blue', 'noPadding', 'bold']}>
              {this.props.title}
            </Text>
            {closeButton}
          </ModalTitle>
          <ChildrenContainer>{this.props.children}</ChildrenContainer>
        </InternalModal>
      </ReactModal>
    )
  }
}
