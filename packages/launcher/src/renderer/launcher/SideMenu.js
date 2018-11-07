//@flow

import type {
  IdentityGetOwnUsersResult as OwnIdentities,
  WalletGetEthWalletsResult as Wallets,
} from '@mainframe/client'
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native-web'

import { truncateAddress } from '../../utils'
import Text from '../UIComponents/Text'
import Icon from '../UIComponents/Icon'
import colors from '../colors'

type Props = {
  onToggleDevMode: () => void,
  devMode?: boolean,
  identities: OwnIdentities,
  wallets?: Wallets,
}

export default class SideMenu extends Component<Props> {
  renderUsers() {
    if (!this.props.identities) {
      return null
    }

    const userList = this.props.identities.users.map(u => {
      return (
        <View key={u.id}>
          <Text style={styles.sideBarLabel}>{u.data.name}</Text>
        </View>
      )
    })
    return (
      <View>
        <Text style={styles.sideBarHeader}>IDENTITIES</Text>
        {userList}
      </View>
    )
  }

  renderWallets() {
    if (!this.props.wallets) {
      return null
    }
    const walletList = Object.keys(this.props.wallets).map(type => {
      let accounts = []
      this.props.wallets[type].forEach(w => {
        const addresses = w.accounts.map(a => {
          return (
            <View key={a}>
              <Text style={styles.sideBarLabel}>{truncateAddress(a)}</Text>
            </View>
          )
        })
        accounts = accounts.concat(addresses)
      })
      return (
        <View key={type}>
          <View style={styles.walletType}>
            <Text style={styles.walletTypeLabel}>{type} wallets</Text>
          </View>
          {accounts}
        </View>
      )
    })
    return (
      <View>
        <Text style={styles.sideBarHeader}>WALLETS</Text>
        {walletList}
      </View>
    )
  }

  render() {
    const sideBarStyles = [styles.sideBarView]
    const devToggleStyles = [styles.devToggleButton]
    if (this.props.devMode) {
      sideBarStyles.push(styles.sideBarDev)
      devToggleStyles.push(styles.devToggleDark)
    }

    return (
      <View style={sideBarStyles}>
        {this.renderUsers()}
        {this.renderWallets()}
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
    backgroundColor: colors.DARK_BLUE,
  },
  sideBarDev: {
    backgroundColor: colors.DARK_BLUE_2,
  },
  sideBarHeader: {
    paddingTop: 20,
    color: colors.LIGHT_GREY_BLUE,
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 2,
  },
  sideBarLabel: {
    paddingTop: 10,
    fontSize: 13,
    color: colors.WHITE,
  },
  walletType: {
    marginTop: 8,
  },
  walletTypeLabel: {
    fontSize: 12,
    color: colors.LIGHT_GREY_BLUE,
  },
  devToggleButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: colors.DARK_BLUE_SHADE_1,
    color: colors.WHITE,
    flexDirection: 'row',
  },
  devToggleDark: {
    backgroundColor: colors.TRANSPARENT_BLACK_30,
    color: colors.LIGHT_GREY_DE,
  },
  devToggleLabel: {
    flex: 1,
    fontSize: 12,
  },
  arrowIcon: {
    paddingTop: 3,
  },
})
