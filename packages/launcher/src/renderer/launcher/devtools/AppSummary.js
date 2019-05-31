// @flow

import { Text } from '@morpheus-ui/core'
// TODO: replace by internal types
import type {
  PermissionKey,
  PermissionRequirement,
  StrictPermissionsRequirements,
} from '@mainframe/app-permissions'
import React, { Component } from 'react'
import styled from 'styled-components/native'

import FormModalView from '../../UIComponents/FormModalView'
import { PERMISSIONS_DESCRIPTIONS } from './PermissionsRequirements'

export type AppData = {
  name?: ?string,
  version?: ?string,
  contentsPath?: ?string,
  developerID?: ?string,
}

type Props = {
  onRequestClose?: () => any,
  onPressBack?: () => any,
  onPressSave: () => any,
  submitButtonTitle?: ?string,
  permissionsRequirements?: StrictPermissionsRequirements,
  appData: AppData,
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
  padding: 10px 0;
  align-items: center;
  justify-content: space-between;
  border-top-width: 1px;
  border-color: #f9f9f9;
  ${props => props.first && `border-top-width: 0;`}
`

const Section = styled.View`
  padding-top: 20px;
  margin-top: 20px;
  border-top-width: 3px;
  border-color: #f9f9f9;
  ${props => props.first && `border-top-width: 0; margin-top: 0;`}
`

export default class AppSummary extends Component<Props> {
  renderPermissionsSummaryRows(
    requirements: StrictPermissionsRequirements,
    type: PermissionRequirement,
  ): Array<Object> {
    return Object.keys(requirements[type]).reduce((acc, key: PermissionKey) => {
      // @$FlowFixMe Missing keys
      const permission = requirements[type][key]
      if (key === 'WEB_REQUEST') {
        if (permission.length) {
          // @$FlowFixMe WEB_REQUEST specific
          permission.forEach(host => {
            acc.push(
              <PermissionRow first={acc.length === 0} key={host}>
                <Text variant={['greyDark23']} size={12}>
                  Make web requests to <Text bold>{host}</Text>
                </Text>
              </PermissionRow>,
            )
          })
        }
      } else {
        if (permission === true) {
          acc.push(
            <PermissionRow first={acc.length === 0} key={key}>
              <Text variant={['greyDark23']} size={12}>
                {PERMISSIONS_DESCRIPTIONS[key]}
              </Text>
            </PermissionRow>,
          )
        }
      }
      return acc
    }, [])
  }

  render() {
    const { appData, permissionsRequirements: requirements } = this.props

    let permissionsContainer = null
    if (requirements) {
      const optionalPermissionRequirements = this.renderPermissionsSummaryRows(
        requirements,
        'optional',
      )
      const requiredPermissionRequirements = this.renderPermissionsSummaryRows(
        requirements,
        'required',
      )

      const optionalPermissions = optionalPermissionRequirements.length ? (
        <Section>
          <Text variant={['greyDark23', 'marginBottom10']} bold size={12}>
            Optional Permissions
          </Text>
          {optionalPermissionRequirements}
        </Section>
      ) : null

      const requiredPermissions = requiredPermissionRequirements.length ? (
        <Section>
          <Text variant={['greyDark23', 'marginBottom10']} bold size={12}>
            Required Permissions
          </Text>
          {requiredPermissionRequirements}
        </Section>
      ) : null

      permissionsContainer = (
        <>
          {optionalPermissions}
          {requiredPermissions}
        </>
      )
    }

    return (
      <FormModalView
        title="App SUMMARY"
        dismissButton={this.props.onPressBack ? 'BACK' : 'CLOSE'}
        onPressDismiss={this.props.onPressBack}
        confirmTestID="create-app-complete-button"
        confirmButton={this.props.submitButtonTitle || 'SAVE'}
        onPressConfirm={this.props.onPressSave}
        onRequestClose={this.props.onRequestClose}>
        <Container>
          <ScrollView>
            <Section first>
              <Text variant={['greyDark23', 'marginBottom10']} bold size={12}>
                App Info
              </Text>
              <PermissionRow first>
                <Text variant={['greyDark23']} size={12}>
                  Name: {appData.name}
                </Text>
              </PermissionRow>
              <PermissionRow>
                <Text variant={['greyDark23']} size={12}>
                  Version: {appData.version}
                </Text>
              </PermissionRow>
              <PermissionRow>
                <Text variant={['greyDark23']} size={12}>
                  Contents path: {appData.contentsPath}
                </Text>
              </PermissionRow>
            </Section>
            {permissionsContainer}
          </ScrollView>
        </Container>
      </FormModalView>
    )
  }
}
