// @flow

import React, { Component } from 'react'
import { Text, DropDown } from '@morpheus-ui/core'
import styled from 'styled-components/native'

import FormModalView from '../UIComponents/FormModalView'
import AppIcon from './apps/AppIcon'
import { AppShadow } from './apps/AppItem'

type Domain = string
type PermissionGranted = boolean

type PermissionOption = {
  WEB_REQUEST?: Array<Domain>,
  [PermissionKey]: boolean,
}

type PermissionOptionValue = $Values<PermissionOption>

// Permissions set by user
export type PermissionsSettings = {
  WEB_REQUEST: { [Domain]: PermissionGranted },
  [PermissionKey]: PermissionGranted,
}

const PERMISSION_NAMES = {
  BLOCKCHAIN_SEND: {
    name: 'Write to the Blockchain',
    description:
      'Allow this app to make transactional calls to the blockchain, e.g. send tokens',
  },
  BLOCKCHAIN_SIGN: {
    name: 'Sign messages using your wallet',
    description:
      'Allow the app to sign data using your Ethereum wallet (we will always request your permission before signing)',
  },
  COMMS_CONTACT: {
    name: 'Communicate with your contacts',
    description: 'Allows the app to communicate data with approved contacts.',
  },
  CONTACTS_READ: {
    name: 'Request to fetch contacts',
    description: 'Allows the app to read data on approved contacts.',
  },
  WEB_REQUEST: {
    name: 'Make Web requests',
    description: 'Allow this app to make Web requests to specified domains',
  },
}

const DROP_DOWN_OPTIONS = ['Ask', 'Always', 'Never']

const formatSettings = (
  settings: $Shape<PermissionsSettings>,
): StrictPermissionsGrants => {
  const { WEB_REQUEST, ...others } = settings
  const domains = Object.keys(WEB_REQUEST)
  const granted = domains.filter(k => WEB_REQUEST[k])
  const denied = domains.filter(k => !WEB_REQUEST[k])
  return {
    ...others,
    WEB_REQUEST: WEB_REQUEST
      ? createWebRequestGrant(granted, denied)
      : createWebRequestGrant(),
  }
}

type Props = {
  mfid: string,
  icon?: ?string,
  name: string,
  permissions: StrictPermissionsRequirements,
  onCancel: () => any,
  onSubmit: (permissions: StrictPermissionsGrants) => any,
}

type State = {
  failedValidation: boolean,
  permissionsSettings: PermissionsSettings,
}

const Container = styled.View`
  flex: 1;
  width: 100%;
  max-width: 600px;
  padding: 0 40px;
  justify-content: center;
`

const ScrollView = styled.ScrollView`
  padding-bottom: 50px;
  flex: 1;
`

const Title = styled.View`
  padding: 20px 0;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f9f9f9;
`

const PermissionRow = styled.View`
  padding: 10px 0;
  margin: 0 10px 10px 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top-width: 1px;
  border-top-color: #f9f9f9;

  ${props => props.option && 'flex-direction: column;'}
  ${props => props.first && 'border-top-width: 0;'}
`

const DropDownContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const PermissionInfo = styled.View`
  flex: 1;
`
const Domains = styled.View`
  padding-top: 5px;
`
const DomainRow = styled.View`
  margin: 0 10px;
  flex-direction: row;
  padding: 7px 0;
`

const IconContainer = styled.View`
  align-items: center;
  margin: 20px 0;
`

export default class PermissionsView extends Component<Props, State> {
  state = {
    failedValidation: false,
    permissionsSettings: {
      WEB_REQUEST: {},
    },
  }

  // HANDLERS

  onPressDone = () => {
    const { permissions } = this.props
    const { permissionsSettings } = this.state
    const settings = formatSettings(permissionsSettings)
    const requiredDomains = permissions.required.WEB_REQUEST || []
    const requiredPermissions = { ...permissions.required }
    settings.WEB_REQUEST.granted.push(...requiredDomains)
    delete requiredPermissions.WEB_REQUEST
    this.props.onSubmit({ ...settings, ...requiredPermissions })
  }

  onSetPermissionGrant = (
    key: PermissionKey,
    granted: ?PermissionGranted,
    option?: string,
  ) => {
    this.setState(({ permissionsSettings }) => {
      if (key === 'WEB_REQUEST') {
        if (option == null) {
          return null // Don't update state
        }
        if (granted == null) {
          delete permissionsSettings.WEB_REQUEST[option]
        } else {
          permissionsSettings.WEB_REQUEST[option] = granted
        }
      } else {
        if (granted == null) {
          delete permissionsSettings[key]
        } else {
          permissionsSettings[key] = granted
        }
      }
      return { permissionsSettings }
    })
  }

  // RENDER

  renderRequired() {
    return (
      <DropDownContainer>
        <DropDown
          variant="small"
          disabled
          label="Required"
          defaultValue="Always"
          options={['Always']}
        />
        <Text size={9} color="#A9A9A9" variant="requiredLabel">
          Required
        </Text>
      </DropDownContainer>
    )
  }

  renderToggle(key: PermissionKey, value: ?boolean, option?: string) {
    const defaultValue = value == null ? 'Ask' : value ? 'Always' : 'Never'

    const onPress = sel =>
      this.onSetPermissionGrant(
        key,
        sel === 'Ask' ? undefined : sel === 'Always',
        option,
      )

    return (
      <DropDownContainer>
        <DropDown
          variant="small"
          label="Ask"
          options={DROP_DOWN_OPTIONS}
          onChange={onPress}
          defaultValue={defaultValue}
        />
        <Text size={9} color="#585858" variant="requiredLabel">
          Optional
        </Text>
      </DropDownContainer>
    )
  }

  renderPermission = (
    key: PermissionKey,
    value: PermissionOptionValue,
    required: boolean,
    first: boolean,
  ) => {
    const permissionData = PERMISSION_NAMES[key]
    if (permissionData == null) {
      return (
        <PermissionRow first={first} key={key}>
          <Text variant="greyDark23" bold size={12}>
            {`This app is asking for permission to an unknown permission key: ${key}`}
          </Text>
        </PermissionRow>
      )
    }

    const { permissionsSettings } = this.state
    let options, domainOptions

    if (key === 'WEB_REQUEST') {
      if (Array.isArray(value)) {
        if (!value.length) {
          return null
        }
        options = null
        domainOptions = (
          <Domains key={`${key}-${value[0]}`}>
            {value.map(domain => (
              <DomainRow key={domain}>
                <Text variant={['greyDark23', 'flex1']} size={12}>
                  {domain}
                </Text>
                {required
                  ? this.renderRequired()
                  : this.renderToggle(
                      'WEB_REQUEST',
                      permissionsSettings.WEB_REQUEST[domain],
                      domain,
                    )}
              </DomainRow>
            ))}
          </Domains>
        )
      } else {
        // Bad data provided
        options = null
      }
    } else {
      options = required
        ? this.renderRequired()
        : // $FlowFixMe
          this.renderToggle(key, permissionsSettings[key])
    }

    return (
      <>
        <PermissionRow first={first} key={key}>
          <PermissionInfo>
            <Text variant="greyDark23" bold size={12}>
              {permissionData.name}
            </Text>
            <Text variant="greyDark23" size={11}>
              {permissionData.description}
            </Text>
          </PermissionInfo>
          {options}
        </PermissionRow>
        {domainOptions}
      </>
    )
  }

  renderPermissionsOptions = () => {
    const { permissions } = this.props

    const required = definitionsExist(permissions.required)
      ? Object.keys(permissions.required).map((key, index) => {
          return this.renderPermission(
            key,
            permissions.required[key],
            true,
            index === 0,
          )
        })
      : null
    const optional = definitionsExist(permissions.optional)
      ? Object.keys(permissions.optional).map((key, index) => {
          return this.renderPermission(
            key,
            permissions.optional[key],
            false,
            index === 0,
          )
        })
      : null

    return required || optional ? (
      <ScrollView>
        <IconContainer>
          <AppIcon id={this.props.mfid} url={this.props.icon} size="small" />
          <AppShadow className="app-shadow" small />
        </IconContainer>
        {required}
        {optional}
      </ScrollView>
    ) : (
      <Title>
        <Text variant="greyDark23" bold size={14}>
          No permission needed
        </Text>
      </Title>
    )
  }

  render() {
    const failedValidation = this.state.failedValidation ? (
      <Text variant="error">
        You have to accept all required permissions to continue.
      </Text>
    ) : null

    return (
      <FormModalView
        dismissButton="CANCEL"
        onRequestClose={this.props.onCancel}
        confirmTestID="installer-save-permissions"
        onPressConfirm={this.onPressDone}
        confirmButton="SAVE"
        title={`${this.props.name}: Manage permissions`}>
        <Container>
          {this.renderPermissionsOptions()}
          {failedValidation}
        </Container>
      </FormModalView>
    )
  }
}
