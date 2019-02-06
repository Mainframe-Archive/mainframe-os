// @flow

import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'
import { graphql, createFragmentContainer, commitMutation } from 'react-relay'

import colors from '../../colors'
import rpc from '../rpc'
import { EnvironmentContext } from '../RelayEnvironment'
import applyContext, { type CurrentUser } from '../LauncherContext'
import ModalView from '../../UIComponents/ModalView'
import type { OwnAppDetailView_ownApp as OwnApp } from './__generated__/OwnAppDetailView_ownApp.graphql.js'

type Props = {
  ownApp: OwnApp,
  onClose: () => void,
  user: CurrentUser,
}

type State = {
  errorMsg?: ?string,
  selectedVersion: string,
  publishing?: ?boolean,
}

const Container = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: row;
`

const Header = styled.View`
  flex-direction: row;
  width: 100%;
  padding-left: 15px;
  align-items: center;
`

const AppIcon = styled.View`
  width: 40px;
  height: 40px;
  background-color: #232323;
  border-radius: 5px;
  margin-right: 20px;
`

const VersionsContainer = styled.View`
  width: 280;
  border-right-width: 1px;
  border-color: ${colors.LIGHT_GREY_E8};
`

const VersionRow = styled.View`
  margin: 5px;
  padding-vertical: 15px;
  padding-horizontal: 10px;
  background-color: ${props =>
    props.selected ? colors.LIGHT_GREY_E5 : 'transparent'};
`

const VersionDetailContainer = styled.View`
  padding-vertical: 25px;
  padding-horizontal: 35px;
  flex: 1;
`

const VersionDetailRow = styled.View`
  margin-bottom: 20px;
`

const ButtonsContainer = styled.View`
  margin-top: 10px;
  flex-direction: row;
`

const ErrorView = styled.View`
  padding-vertical: 15px;
`

const detailTextStyle = { color: colors.GREY_DARK_38, paddingTop: 5 }

const publishVersionMutation = graphql`
  mutation OwnAppDetailViewPublishAppVersionMutation(
    $input: PublishAppVersionInput!
  ) {
    publishAppVersion(input: $input) {
      versionHash
      viewer {
        apps {
          ...OwnAppsView_apps
        }
      }
    }
  }
`

const updateAppDetailsMutation = graphql`
  mutation OwnAppDetailViewUpdateAppDetailsMutation(
    $input: UpdateAppDetailsInput!
  ) {
    updateAppDetails(input: $input) {
      viewer {
        apps {
          ...OwnAppsView_apps
        }
      }
    }
  }
`

export class OwnAppDetailView extends Component<Props, State> {
  static contextType = EnvironmentContext

  constructor(props: Props) {
    super(props)
    const state = {}
    if (props.ownApp.versions && props.ownApp.versions.length) {
      state.selectedVersion = props.ownApp.versions[0].version
    }
    this.state = state
  }

  // HANDLERS

  onPressSave = () => {
    const { ownApp } = this.props
    const input = {
      version: '0.0.3',
      name: 'new name',
      contentsPath: './folder/otherFile/',
      appID: ownApp.localID,
    }

    this.setState({
      publishing: true,
    })

    commitMutation(this.context, {
      mutation: updateAppDetailsMutation,
      variables: { input },
      onCompleted: (res, errors) => {
        let errorMsg
        if (errors) {
          errorMsg = errors.length ? errors[0].message : 'Error Updating app.'
        }
        this.setState({
          publishing: false,
          errorMsg,
        })
      },
      onError: err => {
        this.setState({
          publishing: false,
          errorMsg: err.message,
        })
      },
    })
  }

  onPressPublishVersion = (version: string) => {
    const { ownApp } = this.props
    const input = {
      version,
      appID: ownApp.localID,
    }

    this.setState({
      publishing: true,
    })

    commitMutation(this.context, {
      mutation: publishVersionMutation,
      variables: { input },
      onCompleted: (res, errors) => {
        let errorMsg
        if (errors) {
          errorMsg = errors.length ? errors[0].message : 'Error publishing app.'
        }
        this.setState({
          publishing: false,
          errorMsg,
        })
      },
      onError: err => {
        this.setState({
          publishing: false,
          errorMsg: err.message,
        })
      },
    })
  }

  onPressPublishManifest = () => {
    // TODO: Needs implementing in daemon
  }

  onPressSubmitFoReview = () => {
    // TODO REVERT!
    this.onPressSave()
  }

  onPressOpenApp = async () => {
    const { user, ownApp } = this.props
    try {
      await rpc.launchApp(ownApp.localID, user.localID)
    } catch (err) {
      this.setState({
        errorMsg: err.message,
      })
    }
  }

  // RENDER

  renderVersions() {
    const versions = this.props.ownApp.versions.map(v => {
      const selected = v.version === this.state.selectedVersion
      return (
        <VersionRow selected={selected} key={v.version}>
          <Text variant="greyDark">Version {v.version}</Text>
        </VersionRow>
      )
    })
    return <VersionsContainer>{versions}</VersionsContainer>
  }

  renderVersionDetail() {
    const { ownApp } = this.props
    const version = ownApp.versions.find(
      v => v.version === this.state.selectedVersion,
    )
    if (version) {
      const details = (
        <>
          <VersionDetailRow>
            <Text variant="smallLabel">APP NAME</Text>
            <Text theme={detailTextStyle}>{ownApp.name}</Text>
          </VersionDetailRow>
          <VersionDetailRow>
            <Text variant="smallLabel">VERSION</Text>
            <Text theme={detailTextStyle}>{version.version}</Text>
          </VersionDetailRow>
        </>
      )
      let publishedState
      if (!version.versionHash) {
        const publishVersion = () => this.onPressPublishVersion(version.version)
        const actions = this.state.publishing ? (
          <ActivityIndicator />
        ) : (
          <ButtonsContainer>
            <Button
              title="OPEN"
              variant={['mediumUppercase', 'marginRight10']}
              onPress={this.onPressOpenApp}
            />
            <Button
              title="EDIT"
              variant={['mediumUppercase', 'marginRight10']}
            />
            <Button
              variant={['mediumUppercase', 'red']}
              title="PUBLISH APP"
              onPress={publishVersion}
            />
          </ButtonsContainer>
        )
        publishedState = (
          <>
            <VersionDetailRow>
              <Text variant="smallLabel">CONTENT PATH</Text>
              <Text theme={detailTextStyle}>{ownApp.contentsPath}</Text>
            </VersionDetailRow>
            {actions}
          </>
        )
      } else {
        publishedState = (
          <>
            <VersionDetailRow>
              <Text variant="smallLabel">CONTENTS URI</Text>
              <Text theme={detailTextStyle}>{version.versionHash}</Text>
            </VersionDetailRow>

            <ButtonsContainer>
              <Button
                variant={['mediumUppercase', 'red']}
                title="SUBMIT TO MAINRAME APP STORE"
                onPress={this.onPressSubmitFoReview}
              />
            </ButtonsContainer>
          </>
        )
      }

      const errorView = this.state.errorMsg ? (
        <ErrorView>
          <Text variant="error">{this.state.errorMsg}</Text>
        </ErrorView>
      ) : null
      return (
        <VersionDetailContainer>
          {details}
          {publishedState}
          {errorView}
        </VersionDetailContainer>
      )
    }
  }

  render() {
    const { ownApp } = this.props

    const header = (
      <Header>
        <AppIcon />
        <Text variant={['mediumTitle', 'darkBlue']}>{ownApp.name}</Text>
      </Header>
    )
    return (
      <ModalView
        title={ownApp.name}
        headerView={header}
        onRequestClose={this.props.onClose}>
        <Container>
          {this.renderVersions()}
          {this.renderVersionDetail()}
        </Container>
      </ModalView>
    )
  }
}

const OwnAppDetailViewWithContext = applyContext(OwnAppDetailView)

export default createFragmentContainer(OwnAppDetailViewWithContext, {
  ownApp: graphql`
    fragment OwnAppDetailView_ownApp on OwnApp {
      localID
      name
      contentsPath
      developer {
        id
        name
      }
      versions {
        version
        versionHash
        contentsURI
        permissions {
          optional {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
          required {
            WEB_REQUEST
            BLOCKCHAIN_SEND
          }
        }
      }
      users {
        localID
        identity {
          profile {
            name
          }
        }
      }
    }
  `,
})
