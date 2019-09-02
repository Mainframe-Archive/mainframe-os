// @flow

import { TextField, Text, DropDown } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import CloseIcon from '@morpheus-ui/icons/Close'
import React, { Component } from 'react'
import styled from 'styled-components/native'

import type {
  WebDomainsDefinitions,
  ReadOnlyWebDomainsDefinitions,
} from '../../../types'
import { isValidWebHost } from '../../../validation'

import FormModalView from '../../UIComponents/FormModalView'

type Props = {
  onPressBack?: () => any,
  onRequestClose?: () => any,
  onSetWebDomains: (webDomains: WebDomainsDefinitions) => void,
  webDomains?: WebDomainsDefinitions | ReadOnlyWebDomainsDefinitions,
}

type State = {
  isHovering?: boolean,
  hostInput: string,
  errorMsg?: ?string,
  domains: { [domain: string]: boolean },
}

const Container = styled.View`
  flex: 1;
  width: 500px;
  padding: 20px;
  justify-content: center;
`

const WebHostRow = styled.View`
  flex-direction: row;
  padding: 3px;
  align-items: center;
  justify-content: space-between;
`
const RemoveButton = styled.TouchableOpacity`
  padding: 5px 5px 10px 10px;
`

const WebRequestsContainer = styled.ScrollView`
  padding: 20px 3px;
  margin-top: 20px;
`

const FieldContainer = styled.View`
  border-bottom-width: 1px;
  border-color: #f9f9f9;
`

const domainValidation = (params: FieldValidateFunctionParams) => {
  if (
    params.value &&
    typeof params.value === 'string' &&
    !isValidWebHost(params.value)
  ) {
    return 'Please provide a valid domain, e.g. mainframe.com'
  }
}

export default class SetPermissionsRequirements extends Component<
  Props,
  State,
> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hostInput: '',
      domains: (props.webDomains || []).reduce((acc, w) => {
        acc[w.domain] = !!w.internal
        return acc
      }, {}),
    }
  }

  onPressAddHost = (payload: FormSubmitPayload) => {
    this.setState(({ hostInput, domains }) => {
      return payload.valid && hostInput.length
        ? {
            domains: { ...domains, [hostInput]: true },
            errorMsg: undefined,
            hostInput: '',
          }
        : null
    })
  }

  onChangeHostInput = (value: string) => {
    this.setState({
      errorMsg: undefined,
      hostInput: value,
    })
  }

  onPressSave = () => {
    const { domains } = this.state
    const webDomains: WebDomainsDefinitions = Object.keys(domains).map(
      domain => {
        return { domain, internal: domains[domain] }
      },
    )
    this.props.onSetWebDomains(webDomains)
  }

  onToggle = (domain: string, required: boolean) => {
    this.setState(({ domains }) => {
      return { domains: { ...domains, [domain]: required } }
    })
  }

  removeHost = (domain: string) => {
    this.setState(({ domains }) => {
      const { [domain]: _remove, ...nextDomains } = domains
      return { domains: nextDomains }
    })
  }

  render() {
    const { domains } = this.state

    const domainsList = Object.keys(domains).map(domain => (
      <WebHostRow key={domain}>
        <Text variant={['greyDark23', 'flex1']} size={12}>
          {domain}
        </Text>
        <DropDown
          variant="small"
          label="Optional"
          options={['Optional', 'Required']}
          onChange={sel => this.onToggle(domain, sel === 'Required')}
          defaultValue={domains[domain] ? 'Required' : 'Optional'}
        />
        <RemoveButton onPress={() => this.removeHost(domain)}>
          <CloseIcon width={10} height={10} color="#808080" />
        </RemoveButton>
      </WebHostRow>
    ))

    const permissionRequirements = (
      <WebRequestsContainer>
        <Text variant={['greyDark23', 'marginBottom10']} bold size={12}>
          Web Requests
        </Text>
        <FieldContainer>
          <Text variant={['greyDark23', 'marginBottom10', 'flex1']} size={11}>
            Add Web domains your app need to or may make request to.
          </Text>
          <TextField
            name="domain"
            value={this.state.hostInput}
            onChange={this.onChangeHostInput}
            label="Add domain"
            placeholder="(e.g. mainframe.com)"
            validation={domainValidation}
            submitOnPressIcon
            IconRight={() => <Text variant={['smallButton']}>ADD</Text>}
          />
        </FieldContainer>
        {domainsList}
      </WebRequestsContainer>
    )

    const errorLabel = this.state.errorMsg ? (
      <Text variant="error">{this.state.errorMsg}</Text>
    ) : null

    return (
      <FormModalView
        title="App Permissions"
        dismissButton={this.props.onPressBack ? 'BACK' : 'CANCEL'}
        onPressDismiss={this.props.onPressBack}
        confirmTestID="set-permission-requirements"
        confirmButton="NEXT"
        onSubmitForm={this.onPressAddHost}
        onPressConfirm={this.onPressSave}
        onRequestClose={this.props.onRequestClose}>
        <Container>
          {permissionRequirements}
          {errorLabel}
        </Container>
      </FormModalView>
    )
  }
}
