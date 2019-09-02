// @flow

import { Text } from '@morpheus-ui/core'
import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import type {
  WebDomainsDefinitions,
  ReadOnlyWebDomainsDefinitions,
} from '../../../types'

import FormModalView from '../../UIComponents/FormModalView'

export type AppData = {
  name?: ?string,
  version?: ?string,
  contentsPath?: ?string,
  developerID?: ?string,
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

type Props = {
  onRequestClose?: () => any,
  onPressBack?: () => any,
  onPressSave: () => any,
  submitButtonTitle?: ?string,
  appData: AppData,
  webDomains: WebDomainsDefinitions | ReadOnlyWebDomainsDefinitions,
}

export default function AppSummary(props: Props) {
  const { appData, webDomains } = props

  const domains = useMemo(() => {
    const required = []
    const optional = []
    webDomains.forEach(w => {
      if (w.internal) {
        required.push(w.domain)
      } else {
        optional.push(w.domain)
      }
    })
    return { required, optional }
  }, [webDomains])

  let requiredPermissions = null
  if (domains.required.length > 0) {
    const requiredDomains = domains.required.map(domain => (
      <PermissionRow key={domain}>
        <Text variant={['greyDark23']} size={12}>
          {domain}
        </Text>
      </PermissionRow>
    ))
    requiredPermissions = (
      <Section>
        <Text variant={['greyDark23', 'marginBottom10']} bold size={12}>
          Required Web domains access
        </Text>
        {requiredDomains}
      </Section>
    )
  }

  let optionalPermissions = null
  if (domains.optional.length > 0) {
    const optionalDomains = domains.optional.map(domain => (
      <PermissionRow key={domain}>
        <Text variant={['greyDark23']} size={12}>
          {domain}
        </Text>
      </PermissionRow>
    ))
    optionalPermissions = (
      <Section>
        <Text variant={['greyDark23', 'marginBottom10']} bold size={12}>
          Optional Web domains access
        </Text>
        {optionalDomains}
      </Section>
    )
  }

  return (
    <FormModalView
      title="App SUMMARY"
      dismissButton={props.onPressBack ? 'BACK' : 'CLOSE'}
      onPressDismiss={props.onPressBack}
      confirmTestID="create-app-complete-button"
      confirmButton={props.submitButtonTitle || 'SAVE'}
      onPressConfirm={props.onPressSave}
      onRequestClose={props.onRequestClose}>
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
          {requiredPermissions}
          {optionalPermissions}
        </ScrollView>
      </Container>
    </FormModalView>
  )
}
