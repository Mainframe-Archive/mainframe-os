//@flow
import React, { Component } from 'react'
import { Text } from '@morpheus-ui/core'
import styled from 'styled-components/native'

import FormModalView from '../../UIComponents/FormModalView'
import AppIcon from './AppIcon'
import { AppShadow } from './AppItem'

import { type SuggestedAppData } from './SuggestedItem'

type Props = {
  appData: SuggestedAppData,
  onRequestClose: () => void,
  onPressInstall: (appId: string) => void,
}

const Container = styled.View`
  flex: 1;
  width: 100%;
  max-width: 550px;
  padding: 20px;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
`

const IconContainer = styled.View`
  width: 72px;
  align-items: center;
  margin-bottom: 15px;
`

const TextContainer = styled.View`
  padding: 20px;
`

export default class AppPreviewModal extends Component<Props> {
  onPressInstall = () => {
    this.props.onPressInstall(this.props.appData.hash)
  }
  render() {
    return (
      <FormModalView
        dismissButton="CANCEL"
        confirmButton="INSTALL"
        title={`${this.props.appData.name}: Details`}
        onRequestClose={this.props.onRequestClose}
        onSubmitForm={this.onPressInstall}>
        <Container>
          <IconContainer>
            <AppIcon url={this.props.appData.icon} />
            <AppShadow className="app-shadow" />
          </IconContainer>
          <TextContainer>
            <Text variant={['modalText', 'center']}>
              {this.props.appData.longDescription}
            </Text>
          </TextContainer>
        </Container>
      </FormModalView>
    )
  }
}
