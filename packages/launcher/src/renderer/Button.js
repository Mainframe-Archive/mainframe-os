//@flow

import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native-web'

import { COLORS } from './styles'

type Props = {
  onPress: () => void,
  title: string,
}

export default class AppInstallModal extends Component<Props> {
  onPressImportManifest = () => {
    console.log('import')
  }

  render() {
    return (
      <TouchableOpacity style={styles.installApp} onPress={this.props.onPress}>
        <Text style={styles.installAppText}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  installApp: {
    padding: 10,
    backgroundColor: COLORS.red,
    width: 180,
    borderRadius: 3,
  },
  installAppText: {
    textAlign: 'center',
    color: COLORS.white,
  },
})
