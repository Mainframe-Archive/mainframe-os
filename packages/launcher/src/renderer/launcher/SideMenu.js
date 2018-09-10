//@flow

import type { IdentityGetOwnUsersResult as OwnIdentities } from '@mainframe/client'
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native-web'

import logo from '../../assets/images/mf-icon.png'
import Text from '../UIComponents/Text'
import Icon from '../UIComponents/Icon'
import colors from '../colors'

type Props = {
  onToggleDevMode: () => void,
  devMode?: boolean,
  identities: OwnIdentities,
}

export default class SideMenu extends Component<Props> {
  renderUsers() {
    if (!this.props.identities) {
      return null
    }

    const headerStyles = [styles.sideBarHeader]
    const labelStyles = [styles.sideBarLabel]
    if (this.props.devMode) {
      headerStyles.push(styles.sideBarLabelDark)
      labelStyles.push(styles.sideBarLabelDark)
    }

    const userList = this.props.identities.users.map(u => {
      return (
        <View key={u.id}>
          <Text style={labelStyles}>{u.data.name}</Text>
        </View>
      )
    })
    return (
      <View>
        <Text style={headerStyles}>Identities</Text>
        {userList}
      </View>
    )
  }

  render() {
    const sideBarStyles = [styles.sideBarView]
    const devToggleStyles = [styles.devToggleButton]
    if (this.props.devMode) {
      sideBarStyles.push(styles.sideBarDark)
      devToggleStyles.push(styles.devToggleDark)
    }

    return (
      <View style={sideBarStyles}>
        <Image style={styles.mfLogo} source={logo} resizeMode="contain" />
        {this.renderUsers()}
        <TouchableOpacity
          style={devToggleStyles}
          testID="launcher-toggle-dev-button"
          onPress={this.props.onToggleDevMode}>
          <Text style={styles.devToggleLabel}>
            {this.props.devMode ? 'User Mode' : 'Developer Mode'}
          </Text>
          <Icon name="right-arrow-grey" size={14} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sideBarView: {
    width: 220,
    padding: 20,
    backgroundColor: colors.LIGHT_GREY_E8,
  },
  sideBarDark: {
    backgroundColor: colors.GREY_DARK_2A,
  },
  sideBarHeader: {
    paddingTop: 20,
    color: colors.GREY_DARK_38,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sideBarLabel: {
    paddingTop: 10,
    fontSize: 13,
    color: colors.GREY_DARK_54,
  },
  sideBarLabelDark: {
    color: colors.LIGHT_GREY_E8,
  },
  mfLogo: {
    height: 40,
  },
  devToggleButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: colors.LIGHT_GREY_DE,
    color: colors.GREY_DARK_54,
    flexDirection: 'row',
  },
  devToggleDark: {
    backgroundColor: colors.GREY_DARK_38,
    color: colors.LIGHT_GREY_DE,
  },
  devToggleLabel: {
    flex: 1,
  },
  arrowIcon: {
    paddingTop: 3,
  },
})
