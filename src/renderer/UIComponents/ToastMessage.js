// @flow

import { Text } from '@morpheus-ui/core'
import CloseIcon from '@morpheus-ui/icons/Close'
import React, { type Node } from 'react'
import ReactModal from 'react-modal'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components/native'

type Props = {
  message?: ?string,
  onRequestClose?: () => void,
  children?: ?Node,
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

const ChildrenContainer = styled.View`
  padding: 0px 0px 5px 10px;
`

export default function ToastMessage({
  children,
  message,
  onRequestClose,
}: Props) {
  const closeButton = onRequestClose ? (
    <CloseButton onPress={onRequestClose}>
      <CloseIcon color="#C0C0C0" width={13} height={16} />
    </CloseButton>
  ) : null

  const visible = message != null || children != null

  return (
    <ReactModal
      overlayClassName="alert-modal"
      isOpen={true}
      onRequestClose={onRequestClose}>
      <CSSTransition
        in={visible}
        classNames="alert-toast"
        timeout={300}
        unmountOnExit>
        <Message visible={visible}>
          {message ? (
            <Text bold color="white" size={13}>
              {message}
            </Text>
          ) : null}
          {children ? (
            <ChildrenContainer>{this.props.children}</ChildrenContainer>
          ) : null}
          {closeButton}
        </Message>
      </CSSTransition>
    </ReactModal>
  )
}
