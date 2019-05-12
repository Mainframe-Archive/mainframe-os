//@flow

import React, { Component, type Node } from 'react'
import { Row, Column, Button } from '@morpheus-ui/core'
import {
  Form,
  type FormSubmitPayload,
  type FormChangePayload,
} from '@morpheus-ui/forms'

import styled from 'styled-components/native'

import ModalView from './ModalView'

type Props = {
  title?: string,
  children?: ?Node,
  full?: boolean,
  noButtons?: boolean,
  confirmButton?: ?string,
  dismissButton?: ?string,
  onPressConfirm?: ?() => any,
  onPressDismiss?: ?() => any,
  confirmTestID?: ?string,
  dismissButtonDisabled?: boolean,
  confirmButtonDisabled?: boolean,
  onRequestClose?: () => void,
  onSubmitForm?: (payload: FormSubmitPayload) => any,
  onChangeForm?: (payload: FormChangePayload) => any,
}

const ChildrenContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  flex: 1;
`

export default class FormModalView extends Component<Props> {
  render() {
    return (
      <ModalView
        title={this.props.title}
        full={this.props.full}
        onRequestClose={this.props.onRequestClose}>
        <Form
          onSubmit={this.props.onSubmitForm}
          onChange={this.props.onChangeForm}>
          <ChildrenContainer>
            <ChildrenContainer>{this.props.children}</ChildrenContainer>
            {!this.props.noButtons && (
              <Row className="white-shadow" size={1}>
                <Column styles="align-items:center; margin-bottom: 20px; justify-content: center; flex-direction: row;">
                  {this.props.dismissButton &&
                    (this.props.onPressDismiss ||
                      this.props.onRequestClose) && (
                      <Button
                        title={this.props.dismissButton}
                        disabled={this.props.dismissButtonDisabled}
                        variant={['no-border', 'grey', 'modalButton']}
                        onPress={
                          this.props.onPressDismiss || this.props.onRequestClose
                        }
                      />
                    )}
                  {this.props.confirmButton &&
                    (this.props.onPressConfirm || this.props.onSubmitForm) && (
                      <Button
                        disabled={this.props.confirmButtonDisabled}
                        title={this.props.confirmButton}
                        variant={['red', 'modalButton']}
                        onPress={this.props.onPressConfirm}
                        submit={!!this.props.onSubmitForm}
                        testID={this.props.confirmTestID}
                        invalidFormDisabled
                      />
                    )}
                </Column>
              </Row>
            )}
          </ChildrenContainer>
        </Form>
      </ModalView>
    )
  }
}
