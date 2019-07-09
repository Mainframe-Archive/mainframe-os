// @flow

import { Text, Button } from '@morpheus-ui/core'
import { shell } from 'electron'
import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import {
  graphql,
  createFragmentContainer,
  commitMutation,
  type Environment,
} from 'react-relay'
import type { Match, RouterHistory } from 'react-router-dom'
import styled from 'styled-components/native'

import ArrowLeft from '../../UIComponents/Icons/ArrowLeft'
import CopyableBlock from '../CopyableBlock'
import PlusIcon from '../../UIComponents/Icons/PlusIcon'
import colors from '../../colors'

import rpc from '../rpc'
import AppIcon from '../apps/AppIcon'
import RelayRenderer from '../RelayRenderer'

import AppSummary from './AppSummary'
import EditAppDetailsModal, {
  type CompleteAppData,
} from './EditAppDetailsModal'
import NewAppVersionModal from './NewAppVersionModal'
import SetPermissionsRequirements from './SetPermissionsRequirements'

import type { AppDetailsScreen_app as App } from './__generated__/AppDetailsScreen_app.graphql'

const Container = styled.View`
  flex: 1;
  flex-direction: column;
`

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-bottom-color: #f5f5f5;
  border-top-color: #f5f5f5;
  margin-top: 30px;
  padding: 15px 30px 15px 9px;
`

const BackButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`

const HeaderLabels = styled.View`
  margin-left: 16px;
`

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  background-color: #232323;
  border-radius: 5px;
`
const ButtonsContainer = styled.View`
  margin-top: 20px;
  flex-direction: row;
`

const ErrorView = styled.View`
  padding-vertical: 15px;
`

const ContentContainer = styled.View`
  flex: 1;
  border-left-width: 1px;
  border-left-color: #f5f5f5;
  margin-left: 48px;
`

const VersionContainer = styled.View`
  padding: 0 30px 30px 30px;
  margin-bottom: 10px;
  border-bottom-color: #f5f5f5;

  ${props => props.border && `border-bottom-width: 1px;`}
`

const detailTextStyle = { color: colors.GREY_DARK_38, paddingTop: 5 }

const publishVersionMutation = graphql`
  mutation AppDetailsScreenPublishAppVersionMutation(
    $input: PublishAppVersionInput!
  ) {
    publishAppVersion(input: $input) {
      app {
        ...AppDetailsScreen_app
      }
      versionHash
    }
  }
`

const updateAppDetailsMutation = graphql`
  mutation AppDetailsScreenUpdateAppDetailsMutation(
    $input: UpdateAppDetailsInput!
  ) {
    updateAppDetails(input: $input) {
      app {
        ...AppDetailsScreen_app
      }
    }
  }
`

const setAppPermissionsRequirementsMutation = graphql`
  mutation AppDetailsScreenSetAppPermissionsRequirementsMutation(
    $input: SetAppPermissionsRequirementsInput!
  ) {
    setAppPermissionsRequirements(input: $input) {
      app {
        ...AppDetailsScreen_app
      }
    }
  }
`

const createAppVersionMutation = graphql`
  mutation AppDetailsScreenCreateAppVersionMutation(
    $input: CreateAppVersionInput!
  ) {
    createAppVersion(input: $input) {
      app {
        ...AppDetailsScreen_app
      }
    }
  }
`

type Props = {
  app: App,
  history: RouterHistory,
  relay: {
    environment: Environment,
  },
}

type ModalType =
  | 'confirm_permissions'
  | 'app_summary'
  | 'edit_details'
  | 'new_version'

type State = {
  errorMsg?: ?string,
  publishing?: ?boolean,
  showModal?: ?ModalType,
}

class AppDetails extends Component<Props, State> {
  state = {}

  // HANDLERS

  onPressNewVersion = () => {
    this.setState({ showModal: 'new_version', errorMsg: undefined })
  }

  onSetNewVersion = (version: string) => {
    this.setState({ showModal: undefined })

    commitMutation(this.props.relay.environment, {
      mutation: createAppVersionMutation,
      variables: {
        input: {
          appID: this.props.app.localID,
          version,
        },
      },
      onCompleted: (res, errors) => {
        if (errors) {
          const errorMsg = errors.length
            ? errors[0].message
            : 'Error creating new version.'
          this.setState({ errorMsg })
        }
      },
      onError: err => {
        this.setState({ errorMsg: err.message })
      },
    })
  }

  onPressPublishVersion = () => {
    this.setState({
      showModal: 'confirm_permissions',
    })
  }

  onUpdateAppData = (appData: CompleteAppData) => {
    this.setState({ showModal: undefined })
    commitMutation(this.props.relay.environment, {
      mutation: updateAppDetailsMutation,
      variables: {
        input: {
          appID: this.props.app.localID,
          version: appData.version,
          name: appData.name,
          contentsPath: appData.contentsPath,
        },
      },
      onCompleted: (res, errors) => {
        let errorMsg
        if (errors) {
          errorMsg = errors.length ? errors[0].message : 'Error Updating app.'
        }
        this.setState({
          errorMsg,
        })
      },
      onError: err => {
        this.setState({
          errorMsg: err.message,
        })
      },
    })
  }

  publishApp = () => {
    const { app, relay } = this.props

    this.setState({
      publishing: true,
      showModal: undefined,
    })

    commitMutation(relay.environment, {
      mutation: publishVersionMutation,
      variables: {
        input: { appID: app.localID },
      },
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

  onPressGoBack = () => {
    this.props.history.goBack()
  }

  onPressSubmitFoReview = () => {
    shell.openExternal('https://docs.mainframe.com/docs/mft')
  }

  onPressEdit = () => {
    this.setState({
      showModal: 'edit_details',
    })
  }

  onPressOpenApp = async () => {
    try {
      await rpc.openOwnApp(this.props.app.viewerOwnAppID)
    } catch (err) {
      this.setState({
        errorMsg: err.message,
      })
    }
  }

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  onSetPermissions = (requirements: StrictPermissionsRequirements) => {
    commitMutation(this.props.relay.environment, {
      mutation: setAppPermissionsRequirementsMutation,
      variables: {
        input: {
          appID: this.props.app.localID,
          // $FlowFixMe permission key
          permissionsRequirements: requirements,
        },
      },
      onCompleted: (res, errors) => {
        if (errors) {
          const errorMsg = errors.length
            ? errors[0].message
            : 'Error updating permissions settings.'
          this.setState({
            errorMsg,
            showModal: undefined,
          })
        } else {
          this.setState({
            showModal: 'app_summary',
          })
        }
      },
      onError: err => {
        this.setState({
          errorMsg: err.message,
          showModal: undefined,
        })
      },
    })
  }

  // RENDER

  render() {
    const { app } = this.props
    const appData = {
      name: app.profile.name,
      contentsPath: app.contentsPath,
      version:
        app.inProgressVersion == null
          ? undefined
          : app.inProgressVersion.version,
    }
    const hasDraftVersion = app.inProgressVersion != null
    const hasPublishedVersion = app.latestPublishedVersion != null

    switch (this.state.showModal) {
      case 'confirm_permissions':
        return (
          <SetPermissionsRequirements
            // $FlowFixMe: different definition between library-imported and Relay-generated one
            permissionRequirements={app.inProgressVersion.permissions}
            onSetPermissions={this.onSetPermissions}
            onRequestClose={this.onCloseModal}
          />
        )
      case 'app_summary':
        return (
          <AppSummary
            appData={appData}
            // $FlowFixMe: different definition between library-imported and Relay-generated one
            permissionsRequirements={app.inProgressVersion.permissions}
            onPressBack={this.onPressPublishVersion}
            onRequestClose={this.onCloseModal}
            onPressSave={this.publishApp}
            submitButtonTitle="PUBLISH"
          />
        )
      case 'edit_details':
        return (
          <EditAppDetailsModal
            isEdition
            submitButtonTitle="SAVE"
            onRequestClose={this.onCloseModal}
            onSetAppData={this.onUpdateAppData}
            appData={appData}
            previousVersion={
              app.latestPublishedVersion == null
                ? undefined
                : app.latestPublishedVersion.version
            }
          />
        )
      case 'new_version':
        return (
          <NewAppVersionModal
            currentVersion={appData.version || '1.0.0'}
            onRequestClose={this.onCloseModal}
            onSetVersion={this.onSetNewVersion}
          />
        )
      default:
    }

    const headerPublished = hasPublishedVersion ? (
      <Text variant="mono" color="#00A7E7" size={10}>
        App ID: {app.publicID}
      </Text>
    ) : (
      <Text color="#da1157" size={12}>
        Not published
      </Text>
    )

    const header = (
      <Header>
        <BackButton onPress={this.onPressGoBack}>
          <ArrowLeft />
        </BackButton>
        <IconContainer>
          <AppIcon size="small" id={app.publicID} />
        </IconContainer>
        <HeaderLabels>
          <Text variant={['mediumTitle', 'darkBlue']}>{app.profile.name}</Text>
          {headerPublished}
        </HeaderLabels>
      </Header>
    )

    let contents
    if (this.state.publishing) {
      contents = (
        <ContentContainer>
          <VersionContainer>
            <Text variant="smallLabel">
              Publishing {hasPublishedVersion ? 'update' : 'app'}...
            </Text>
            <ActivityIndicator />
          </VersionContainer>
        </ContentContainer>
      )
    } else {
      const openButton = (
        <Button
          title="OPEN"
          variant={['mediumUppercase', 'marginRight10']}
          onPress={this.onPressOpenApp}
        />
      )

      const publishedVersionInfo =
        app.latestPublishedVersion == null ? null : (
          <VersionContainer border={hasDraftVersion}>
            <Text variant="smallLabel">Published version</Text>
            <Text theme={detailTextStyle}>
              {app.latestPublishedVersion.version}
            </Text>
            <Text variant="smallLabel">App Id</Text>
            <Text theme={detailTextStyle}>
              Share this app ID to allow users to install your app in Mainframe
              OS.
            </Text>
            <CopyableBlock value={app.publicID} />
            {hasDraftVersion ? null : (
              <ButtonsContainer>
                {openButton}
                <Button
                  variant={['mediumUppercase', 'marginRight10']}
                  title="SUBMIT TO MAINFRAME APP STORE"
                  onPress={this.onPressSubmitFoReview}
                />
                <Button
                  variant={['mediumUppercase', 'redOutline']}
                  title="NEW VERSION"
                  Icon={PlusIcon}
                  onPress={this.onPressNewVersion}
                />
              </ButtonsContainer>
            )}
          </VersionContainer>
        )

      const versionContents =
        app.inProgressVersion == null ? null : (
          <VersionContainer>
            <Text variant="smallLabel">Draft version</Text>
            <Text theme={detailTextStyle}>{app.inProgressVersion.version}</Text>

            <Text variant="smallLabel">CONTENT PATH</Text>
            <Text theme={detailTextStyle}>{app.contentsPath}</Text>
            <ButtonsContainer>
              {openButton}
              <Button
                title="EDIT"
                variant={['mediumUppercase', 'marginRight10']}
                onPress={this.onPressEdit}
              />
              <Button
                variant={['mediumUppercase', 'redOutline']}
                title={hasPublishedVersion ? 'PUBLISH UPDATE' : 'PUBLISH APP'}
                onPress={this.onPressPublishVersion}
              />
            </ButtonsContainer>
          </VersionContainer>
        )

      const errorView = this.state.errorMsg ? (
        <ErrorView>
          <Text variant="error">{this.state.errorMsg}</Text>
        </ErrorView>
      ) : null

      contents = (
        <ContentContainer>
          {publishedVersionInfo}
          {versionContents}
          {errorView}
        </ContentContainer>
      )
    }

    return (
      <Container>
        {header}
        {contents}
      </Container>
    )
  }
}

const RelayContainer = createFragmentContainer(AppDetails, {
  app: graphql`
    fragment AppDetailsScreen_app on OwnApp {
      localID
      publicID
      profile {
        name
      }
      contentsPath
      developer {
        localID
        profile {
          name
        }
      }
      inProgressVersion {
        version
        permissions {
          optional {
            CONTACT_COMMUNICATION
            CONTACT_LIST
            ETHEREUM_TRANSACTION
            WEB_REQUEST
          }
          required {
            CONTACT_COMMUNICATION
            CONTACT_LIST
            ETHEREUM_TRANSACTION
            WEB_REQUEST
          }
        }
      }
      latestPublishedVersion {
        version
      }
      viewerOwnAppID
    }
  `,
})

type ScreenProps = {
  match: Match,
  history: RouterHistory,
}

export default function AppDetailsScreen(screenProps: ScreenProps) {
  return (
    <RelayRenderer
      render={({ props }) => {
        return props == null ? null : (
          <RelayContainer {...props} history={screenProps.history} />
        )
      }}
      query={graphql`
        query AppDetailsScreenQuery($appID: ID!) {
          app: node(id: $appID) {
            ... on OwnApp {
              ...AppDetailsScreen_app
            }
          }
        }
      `}
      variables={{ appID: screenProps.match.params.appID }}
    />
  )
}
