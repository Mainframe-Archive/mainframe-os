// @flow

import React, { Component } from 'react'
import { Text, DropDown } from '@morpheus-ui/core'
import memoize from 'memoize-one'
import styled from 'styled-components/native'

import type {
  WebDomainsDefinitions,
  ReadOnlyWebDomainsDefinitions,
} from '../../types'

import FormModalView from '../UIComponents/FormModalView'
import AppIcon from './apps/AppIcon'
import { AppShadow } from './apps/AppItem'

const DROP_DOWN_OPTIONS = ['Ask', 'Always', 'Never']

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

type Props = {
  publicID: string,
  name: string,
  webDomainsGrants?: WebDomainsDefinitions | ReadOnlyWebDomainsDefinitions,
  webDomainsRequirements: WebDomainsDefinitions | ReadOnlyWebDomainsDefinitions,
  onCancel: () => any,
  onSubmit: (webDomains: ReadOnlyWebDomainsDefinitions) => any,
}

type WebDomainGrants = { internal: boolean, external?: ?boolean }

type State = {
  failedValidation: boolean,
  webDomainsGrants: { [domain: string]: WebDomainGrants },
}

export default class PermissionsView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      failedValidation: false,
      webDomainsGrants: props.webDomainsGrants
        ? props.webDomainsGrants.reduce((acc, webDomainGrant) => {
            const { domain, ...grants } = webDomainGrant
            acc[domain] = grants
            return acc
          }, {})
        : {},
    }
  }

  onPressDone = () => {
    const { webDomainsRequirements } = this.props
    const { webDomainsGrants } = this.state

    webDomainsRequirements.forEach(w => {
      if (w.internal) {
        const grants = webDomainsGrants[w.domain] || {}
        webDomainsGrants[w.domain] = { ...grants, internal: true }
      }
    })

    const webDomains: ReadOnlyWebDomainsDefinitions = Object.keys(
      webDomainsGrants,
    ).map(domain => {
      return { ...webDomainsGrants[domain], domain }
    })
    this.props.onSubmit(webDomains)
  }

  onSetGrant = (domain: string, granted: ?boolean) => {
    this.setState(({ webDomainsGrants }) => {
      const grant = webDomainsGrants[domain] || {}
      return {
        webDomainsGrants: {
          ...webDomainsGrants,
          [domain]: { ...grant, internal: granted },
        },
      }
    })
  }

  splitWebDomains = memoize(
    (
      webDomains: WebDomainsDefinitions | ReadOnlyWebDomainsDefinitions,
    ): { required: WebDomainsDefinitions, optional: WebDomainsDefinitions } => {
      const required = []
      const optional = []
      webDomains.forEach(w => {
        if (w.internal) {
          required.push({ ...w })
        } else {
          optional.push({ ...w })
        }
      })
      return { required, optional }
    },
  )

  render() {
    const { onCancel, name, webDomainsRequirements } = this.props

    let content
    if (webDomainsRequirements.length === 0) {
      content = (
        <Title>
          <Text variant="greyDark23" bold size={14}>
            No permission needed
          </Text>
        </Title>
      )
    } else {
      const domains = this.splitWebDomains(webDomainsRequirements)

      let required = null
      if (domains.required.length > 0) {
        required = domains.required.map(w => (
          <DomainRow key={w.domain}>
            <Text variant={['greyDark23', 'flex1']} size={12}>
              {w.domain}
            </Text>
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
          </DomainRow>
        ))
      }

      let optional = null
      if (domains.optional.length > 0) {
        optional = domains.optional.map(w => (
          <DomainRow key={w.domain}>
            <Text variant={['greyDark23', 'flex1']} size={12}>
              {w.domain}
            </Text>
            <DropDownContainer>
              <DropDown
                variant="small"
                label="Ask"
                options={DROP_DOWN_OPTIONS}
                onChange={selected => {
                  this.onSetGrant(
                    w.domain,
                    selected === 'Ask' ? undefined : selected === 'Always',
                  )
                }}
                defaultValue={
                  w.internal == null ? 'Ask' : w.internal ? 'Always' : 'Never'
                }
              />
              <Text size={9} color="#585858" variant="requiredLabel">
                Optional
              </Text>
            </DropDownContainer>
          </DomainRow>
        ))
      }

      content = (
        <ScrollView>
          <IconContainer>
            <AppIcon id={this.props.publicID} size="small" />
            <AppShadow className="app-shadow" small />
          </IconContainer>
          <PermissionRow first>
            <PermissionInfo>
              <Text variant="greyDark23" bold size={12}>
                Make Web requests
              </Text>
              <Text variant="greyDark23" size={11}>
                Allow this app to make Web requests to specified domains
              </Text>
            </PermissionInfo>
          </PermissionRow>
          <PermissionRow>
            <Domains>
              {required}
              {optional}
            </Domains>
          </PermissionRow>
        </ScrollView>
      )
    }

    const failedValidation = this.state.failedValidation ? (
      <Text variant="error">
        You have to accept all required permissions to continue.
      </Text>
    ) : null

    return (
      <FormModalView
        dismissButton="CANCEL"
        onRequestClose={onCancel}
        confirmTestID="installer-save-permissions"
        onPressConfirm={this.onPressDone}
        confirmButton="SAVE"
        title={`${name}: Manage permissions`}>
        <Container>
          {content}
          {failedValidation}
        </Container>
      </FormModalView>
    )
  }
}
