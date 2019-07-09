// @flow

import { TextField, Text, DropDown } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import CloseIcon from '@morpheus-ui/icons/Close'
import React, { Component } from 'react'
import styled from 'styled-components/native'

import { isValidWebHost } from '../../../validation'

import FormModalView from '../../UIComponents/FormModalView'

type WebDomains = Array<{ domain: string, internal?: ?boolean }>

type Props = {
  onPressBack?: () => any,
  onRequestClose?: () => any,
  onSetWebDomains: (webDomains: WebDomains) => void,
  webDomains?: WebDomains,
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
const ScrollView = styled.ScrollView``

const PermissionRow = styled.View`
  flex-direction: row;
  padding: 5px 3px;
  align-items: center;
  justify-content: space-between;
  border-top-width: 1px;
  border-color: #f9f9f9;
  ${props => props.first && `border-top-width: 0;`}
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

const WebRequestsContainer = styled.View`
  padding: 20px 3px;
  margin-top: 20px;
  border-top-width: 3px;
  border-color: #f9f9f9;
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
    const webDomains = Object.keys(domains).map(domain => {
      return { domain, internal: domains[domain] }
    })
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
  // RENDER

  renderToggle = (
    domain: string,
    required: boolean,
    onToggle: (domain: string, required: boolean) => void,
  ) => {
    const onPress = sel => onToggle(domain, sel === 'Required')

    return (
      <DropDown
        variant="small"
        label="Optional"
        options={['Optional', 'Required']}
        onChange={onPress}
        defaultValue={required ? 'Required' : 'Optional'}
      />
    )
  }

  render() {
    // TODO: remove all logic not needed for web domains

    const { permissionSettings } = this.state
    const permissionOptions = Object.keys(PERMISSIONS_DESCRIPTIONS).map(
      (key, index) => {
        if (key === 'WEB_REQUEST') {
          const hostRequirements = Object.keys(
            permissionSettings.WEB_REQUEST,
          ).map(host => {
            return (
              <WebHostRow key={host}>
                <Text variant={['greyDark23', 'flex1']} size={12}>
                  {host}
                </Text>
                {this.renderToggle(
                  key,
                  permissionSettings.WEB_REQUEST[host],
                  this.onToggle,
                  host,
                )}
                <RemoveButton onPress={() => this.removeHost(host)}>
                  <CloseIcon width={10} height={10} color="#808080" />
                </RemoveButton>
              </WebHostRow>
            )
          })
          return (
            <WebRequestsContainer key={key}>
              <Text variant={['greyDark23', 'marginBottom10']} bold size={12}>
                HTTPS Requests
              </Text>
              <FieldContainer>
                <Text
                  variant={['greyDark23', 'marginBottom10', 'flex1']}
                  size={11}>
                  {PERMISSIONS_DESCRIPTIONS[key]}
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
              {hostRequirements}
            </WebRequestsContainer>
          )
        }

        return (
          <PermissionRow first={index === 0} key={key}>
            <Text variant={['greyDark23']} size={12}>
              {PERMISSIONS_DESCRIPTIONS[key]}
            </Text>
            {this.renderToggle(key, permissionSettings[key], this.onToggle)}
          </PermissionRow>
        )
      },
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
          <ScrollView>
            <Text variant={['greyDark23']} bold size={12}>
              Blockchain
            </Text>
            {permissionOptions}
          </ScrollView>
          {errorLabel}
        </Container>
      </FormModalView>
    )
  }
}
