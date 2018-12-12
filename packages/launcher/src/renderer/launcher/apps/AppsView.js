// @flow

import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import { havePermissionsToGrant } from '@mainframe/app-permissions'
import type { AppOwnData, AppInstalledData, ID } from '@mainframe/client'

import Text from '../../UIComponents/Text'
import ModalView from '../../UIComponents/ModalView'
import IdentitySelectorView from '../IdentitySelectorView'
import colors from '../../colors'
import rpc from '../rpc'

type AppData = AppOwnData | AppInstalledData

type Props = {
  apps: {
    installed: Array<AppData>,
    own: Array<AppData>,
  },
}

type State = {
  showModal?: ?{
    type: 'select_id' | 'accept_permissions',
    data: ?{
      app: AppData,
      own: boolean,
      userID?: ?string,
    },
  },
}

class AppsView extends Component<Props, State> {
  state = {}

  onOpenApp = (app: AppData, own: boolean) => {
    this.setState({
      showModal: {
        type: 'select_id',
        data: {
          app,
          own,
        },
      },
    })
  }

  onSelectAppUser = async (userID: ID) => {
    const { showModal } = this.state
    if (
      showModal &&
      showModal.data &&
      showModal.data.app &&
      showModal.type === 'select_id'
    ) {
      const { app, own } = showModal.data
      const user = app.users.find(u => u.id === userID)
      if (
        !own &&
        havePermissionsToGrant(app.manifest.permissions) &&
        (!user || !user.settings.permissionsSettings.permissionsChecked)
      ) {
        // If this user hasn't used the app before
        // we need to ask to accept permissions
        const data = { ...showModal.data }
        data['userID'] = userID
        this.setState({
          showModal: {
            type: 'accept_permissions',
            data,
          },
        })
      } else {
        try {
          await rpc.launchApp(app.appID, userID)
        } catch (err) {
          // TODO: - Error feedback
        }
        this.setState({
          showModal: undefined,
        })
      }
    }
  }

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  renderApp(app: AppData, own: boolean) {
    const open = () => this.onOpenApp(app, own)
    return (
      <TouchableOpacity onPress={open} key={app.appID} style={styles.app}>
        <Text>{app.name}</Text>
        <Text>{app.appID}</Text>
      </TouchableOpacity>
    )
  }

  renderApps(apps: Array<AppData>, own: boolean) {
    return (
      <View>
        <Text>{own ? 'Own Apps' : 'Installed App'}</Text>
        {apps.map(app => this.renderApp(app, own))}
      </View>
    )
  }

  renderInstalled() {
    return this.renderApps(this.props.apps.installed, false)
  }

  renderOwn() {
    return this.renderApps(this.props.apps.own, true)
  }

  renderIdentitySelector() {
    return (
      <ModalView isOpen={true} onRequestClose={this.onCloseModal}>
        <IdentitySelectorView
          enableCreate
          type="user"
          onSelectId={this.onSelectAppUser}
          onCreatedId={this.onSelectAppUser}
        />
      </ModalView>
    )
  }

  render() {
    if (this.state.showModal) {
      return this.renderIdentitySelector()
    }
    return (
      <View>
        {this.renderInstalled()}
        {this.renderOwn()}
      </View>
    )
  }
}

export default createFragmentContainer(AppsView, {
  apps: graphql`
    fragment AppsView_apps on AppsQuery {
      installed {
        id
        appID
        name
        users {
          localId
          identity {
            profile {
              name
            }
          }
        }
      }
      own {
        id
        appID
        name
        users {
          localId
          identity {
            profile {
              name
            }
          }
        }
      }
    }
  `,
})

const styles = StyleSheet.create({
  app: {
    padding: 10,
    marginTop: 10,
    backgroundColor: colors.LIGHT_GREY_EE,
  },
})
