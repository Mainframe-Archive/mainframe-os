// @flow

import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { Text, Button } from '@morpheus-ui/core'
import { graphql, createFragmentContainer, commitMutation } from 'react-relay'
import type { StrictPermissionsRequirements } from '@mainframe/app-permissions'
import { shell } from 'electron'

import colors from '../../colors'
import rpc from '../rpc'
import { EnvironmentContext } from '../RelayEnvironment'
import applyContext, { type CurrentUser } from '../LauncherContext'
import ModalView from '../../UIComponents/ModalView'
import AppIcon from '../apps/AppIcon'

import EditAppDetailsModal, {
  type CompleteAppData,
} from './EditAppDetailsModal'
import NewVersionModal from './NewVersionModal'
import PermissionsRequirementsView from './PermissionsRequirements'
import AppSummary from './AppSummary'

import type { OwnAppDetailView_ownApp as OwnApp } from './__generated__/OwnAppDetailView_ownApp.graphql'

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

const HeaderLabels = styled.View`
  margin-left: 16px;
`

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  background-color: #232323;
  border-radius: 5px;
`

const VersionsContainer = styled.View`
  width: 280;
  border-right-width: 1px;
  border-color: ${colors.LIGHT_GREY_E8};
`

const VersionRow = styled.TouchableOpacity`
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

const setAppPermissionsRequirementsMutation = graphql`
  mutation OwnAppDetailViewSetAppPermissionsRequirementsMutation(
    $input: SetAppPermissionsRequirementsInput!
  ) {
    setAppPermissionsRequirements(input: $input) {
      viewer {
        apps {
          ...OwnAppsView_apps
        }
      }
    }
  }
`

const createAppVersionMutation = graphql`
  mutation OwnAppDetailViewAppCreateVersionMutation(
    $input: AppCreateVersionMutationInput!
  ) {
    createAppVersion(input: $input) {
      app {
        ...OwnAppDetailView_ownApp
      }
    }
  }
`

type Props = {
  ownApp: OwnApp,
  onClose: () => void,
  user: CurrentUser,
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
  selectedVersionIndex: number,
}

class OwnAppDetailView extends Component<Props, State> {
  static contextType = EnvironmentContext

  constructor(props: Props) {
    super(props)
    this.state = {
      selectedVersionIndex: 0,
    }
  }

  get selectedVersion() {
    return this.props.ownApp.versions[this.state.selectedVersionIndex]
  }

  // HANDLERS

  onSelectVersion = (index: number) => {
    this.setState({ selectedVersionIndex: index })
  }

  onPressNewVersion = () => {
    this.setState({ showModal: 'new_version', errorMsg: undefined })
  }

  onSetNewVersion = (version: string) => {
    this.setState({ showModal: undefined })

    commitMutation(this.context, {
      mutation: createAppVersionMutation,
      variables: {
        input: {
          appID: this.props.ownApp.localID,
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
    const { ownApp } = this.props
    const input = {
      appID: ownApp.localID,
      version: appData.version,
      name: appData.name,
      contentsPath: appData.contentsPath,
    }

    this.setState({
      selectedVersionIndex: 0,
      showModal: undefined,
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
    const { ownApp } = this.props
    const input = {
      appID: ownApp.localID,
      version: ownApp.currentVersionData.version,
    }

    this.setState({
      publishing: true,
      showModal: undefined,
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

  onPressSubmitFoReview = () => {
    shell.openExternal('https://docs.mainframe.com/docs/mft')
  }

  onPressEdit = () => {
    this.setState({
      showModal: 'edit_details',
    })
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

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  onSetPermissions = (requirements: StrictPermissionsRequirements) => {
    const { ownApp } = this.props
    const input = {
      permissionsRequirements: requirements,
      appID: ownApp.localID,
    }
    commitMutation(this.context, {
      mutation: setAppPermissionsRequirementsMutation,
      // $FlowFixMe permission key
      variables: { input },
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

  renderVersions() {
    const { currentVersionData, versions } = this.props.ownApp
    const { selectedVersionIndex } = this.state

    const newVersion =
      currentVersionData.versionHash == null ? null : (
        <VersionRow key="new-version" onPress={this.onPressNewVersion}>
          <Text variant="greyDark">New version</Text>
        </VersionRow>
      )

    const versionRows = versions.map((v, i) => (
      <VersionRow
        key={v.version}
        onPress={() => {
          this.onSelectVersion(i)
        }}
        selected={selectedVersionIndex === i}>
        <Text variant="greyDark">Version {v.version}</Text>
      </VersionRow>
    ))

    return (
      <VersionsContainer>
        {newVersion}
        {versionRows}
      </VersionsContainer>
    )
  }

  renderVersionDetail() {
    const { ownApp } = this.props
    const details = (
      <>
        <VersionDetailRow>
          <Text variant="smallLabel">APP NAME</Text>
          <Text theme={detailTextStyle}>{ownApp.name}</Text>
        </VersionDetailRow>
        <VersionDetailRow>
          <Text variant="smallLabel">VERSION</Text>
          <Text theme={detailTextStyle}>{this.selectedVersion.version}</Text>
        </VersionDetailRow>
      </>
    )

    let publishedState
    if (!this.selectedVersion.versionHash) {
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
            onPress={this.onPressEdit}
          />
          <Button
            variant={['mediumUppercase', 'red']}
            title="PUBLISH APP"
            onPress={this.onPressPublishVersion}
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
          <ButtonsContainer>
            <Button
              title="OPEN"
              variant={['mediumUppercase', 'marginRight10']}
              onPress={this.onPressOpenApp}
            />
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

  render() {
    const { ownApp } = this.props

    const appData = {
      name: ownApp.name,
      contentsPath: ownApp.contentsPath,
      version: this.selectedVersion.version,
    }

    switch (this.state.showModal) {
      case 'confirm_permissions':
        return (
          <PermissionsRequirementsView
            // $FlowFixMe: different definition between library-imported and Relay-generated one
            permissionRequirements={this.selectedVersion.permissions}
            onSetPermissions={this.onSetPermissions}
            onRequestClose={this.onCloseModal}
          />
        )
      case 'app_summary':
        return (
          <AppSummary
            appData={appData}
            // $FlowFixMe: different definition between library-imported and Relay-generated one
            permissionsRequirements={this.selectedVersion.permissions}
            onPressBack={this.onPressPublishVersion}
            onRequestClose={this.onCloseModal}
            onPressSave={this.publishApp}
            submitButtonTitle="PUBLISH"
          />
        )
      case 'edit_details': {
        const previousVersion = ownApp.versions.find(v => v.versionHash != null)
        return (
          <EditAppDetailsModal
            isEdition
            submitButtonTitle="SAVE"
            onRequestClose={this.onCloseModal}
            onSetAppData={this.onUpdateAppData}
            appData={appData}
            previousVersion={
              previousVersion ? previousVersion.version : undefined
            }
          />
        )
      }

      case 'new_version':
        return (
          <NewVersionModal
            currentVersion={ownApp.currentVersionData.version}
            onRequestClose={this.onCloseModal}
            onSetVersion={this.onSetNewVersion}
          />
        )
      default:
    }

    const header = (
      <Header>
        <IconContainer>
          <AppIcon size="small" id={ownApp.mfid} />
        </IconContainer>
        <HeaderLabels>
          <Text variant={['mediumTitle', 'darkBlue']}>{ownApp.name}</Text>
          <Text variant="greyMed" size={12}>
            App ID: {ownApp.updateFeedHash}
          </Text>
        </HeaderLabels>
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
      mfid
      name
      contentsPath
      updateFeedHash
      developer {
        id
        name
      }
      currentVersionData {
        version
        versionHash
      }
      versions {
        version
        versionHash
        permissions {
          optional {
            WEB_REQUEST
            BLOCKCHAIN_SEND
            COMMS_CONTACT
            CONTACTS_READ
          }
          required {
            WEB_REQUEST
            BLOCKCHAIN_SEND
            COMMS_CONTACT
            CONTACTS_READ
          }
        }
      }
    }
  `,
})
