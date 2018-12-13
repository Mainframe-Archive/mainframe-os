//@flow

import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native-web'

import Text from '../UIComponents/Text'
import colors from '../colors'

export type ScreenNames =
  | 'apps'
  | 'identities'
  | 'contacts'
  | 'wallets'
  | 'settings'

type Props = {
  onSelectMenuItem: (name: ScreenNames) => void,
}

type State = {
  selectedItem: ScreenNames,
}

const MENU_ITEMS: Array<ScreenNames> = [
  'apps',
  'identities',
  'contacts',
  'wallets',
  'settings',
]

export default class SideMenu extends Component<Props, State> {
  onPressMenuItem = (name: ScreenNames) => {
    this.setState({
      selectedItem: name,
    })
    this.props.onSelectMenuItem(name)
  }

  renderMenuItem(item: ScreenNames) {
    return (
      <TouchableOpacity
        key={item}
        style={styles.menuItem}
        onPress={() => this.onPressMenuItem(item)}>
        <Text>{item}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.sideBarView}>
        {MENU_ITEMS.map(i => this.renderMenuItem(i))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sideBarView: {
    width: 220,
    padding: 20,
    backgroundColor: colors.LIGHT_GREY_EE,
  },
  menuItem: {
    paddingVertical: 10,
  },
})
