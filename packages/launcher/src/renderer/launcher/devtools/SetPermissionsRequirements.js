// @flow

import { TextField, Text, DropDown } from '@morpheus-ui/core'
import {
  type FormSubmitPayload,
  type FieldValidateFunctionParams,
} from '@morpheus-ui/forms'
import CloseIcon from '@morpheus-ui/icons/Close'
// TODO: remove dependency on this package, these types should be added in the OS package
import type {
  StrictPermissionsRequirements,
  PermissionRequirement,
  PermissionKey,
  PermissionKeyBasic,
} from '@mainframe/app-permissions'
import React, { Component } from 'react'
import styled from 'styled-components/native'

import { isValidWebHost } from '../../../validation'

import FormModalView from '../../UIComponents/FormModalView'

type Props = {
  onPressBack?: () => any,
  onRequestClose?: () => any,
  onSetPermissions: (permissions: StrictPermissionsRequirements) => void,
  permissionRequirements?: StrictPermissionsRequirements,
}

type PermissionSettings = {
  WEB_REQUEST: { [host: string]: PermissionRequirement },
  [PermissionKeyBasic]: PermissionRequirement,
}

type State = {
  isHovering?: boolean,
  hostInput: string,
  errorMsg?: ?string,
  permissionSettings: PermissionSettings,
}

export const PERMISSIONS_DESCRIPTIONS = {
  CONTACT_COMMUNICATION: 'Communicate data with contacts',
  CONTACT_LIST: 'Access user contacts',
  ETHEREUM_TRANSACTION: 'Make transactions to Ethereum blockchain',
  WEB_REQUEST: 'Set required web request hosts',
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
    const permissionSettings: PermissionSettings = {
      WEB_REQUEST: {},
    }
    const requirements = props.permissionRequirements
    if (requirements) {
      Object.keys(requirements).forEach(
        (requirement: PermissionRequirement) => {
          Object.keys(requirements[requirement]).forEach(
            (key: PermissionKey) => {
              if (
                key === 'WEB_REQUEST' &&
                Array.isArray(requirements[requirement].WEB_REQUEST)
              ) {
                requirements[requirement].WEB_REQUEST.forEach(host => {
                  permissionSettings.WEB_REQUEST[host] = requirement
                })
              } else if (key !== 'WEB_REQUEST') {
                if (requirements[requirement][key]) {
                  permissionSettings[key] = requirement
                }
              }
            },
          )
        },
      )
    }
    this.state = {
      hostInput: '',
      permissionSettings,
    }
  }

  onPressAddHost = (payload: FormSubmitPayload) => {
    const { hostInput } = this.state
    if (payload.valid && hostInput) {
      this.setState(({ permissionSettings }) => {
        permissionSettings.WEB_REQUEST[hostInput] = 'required'
        return {
          permissionSettings,
          errorMsg: undefined,
          hostInput: '',
        }
      })
    }
  }

  onChangeHostInput = (value: string) => {
    this.setState({
      errorMsg: undefined,
      hostInput: value,
    })
  }

  onPressSave = () => {
    const { permissionSettings } = this.state
    const formattedPermissions: StrictPermissionsRequirements = {
      optional: {
        WEB_REQUEST: [],
      },
      required: {
        WEB_REQUEST: [],
      },
    }
    const keys: Array<PermissionKey> = Object.keys(permissionSettings)
    keys.forEach((key: PermissionKey) => {
      if (key === 'WEB_REQUEST') {
        Object.keys(permissionSettings.WEB_REQUEST).forEach(host => {
          const requirement = permissionSettings.WEB_REQUEST[host]
          formattedPermissions[requirement].WEB_REQUEST.push(host)
        })
      } else {
        const requirement = permissionSettings[key]
        formattedPermissions[requirement][key] = true
      }
    })
    this.props.onSetPermissions(formattedPermissions)
  }

  onToggle = (
    key: PermissionKey,
    newState: PermissionRequirement,
    host?: string,
  ) => {
    this.setState(({ permissionSettings }) => {
      if (key === 'WEB_REQUEST' && host) {
        permissionSettings.WEB_REQUEST[host] = newState
      } else if (key !== 'WEB_REQUEST') {
        permissionSettings[key] = newState
      }
      return { permissionSettings }
    })
  }

  removeHost = (host: string) => {
    this.setState(({ permissionSettings }) => {
      delete permissionSettings.WEB_REQUEST[host]
      return { permissionSettings }
    })
  }
  // RENDER

  renderToggle = (
    key: PermissionKey,
    state: PermissionRequirement,
    onToggle: (
      key: PermissionKey,
      type: PermissionRequirement,
      host?: string,
    ) => void,
    host?: string,
  ) => {
    const onPress = sel => onToggle(key, sel.toLowerCase(), host)

    return (
      <DropDown
        variant="small"
        label="Optional"
        options={['Optional', 'Required']}
        onChange={onPress}
        defaultValue={
          state
            ? `${state.charAt(0).toUpperCase()}${state.slice(1)}`
            : 'Optional'
        }
      />
    )
  }

  render() {
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
