//@flow

import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native-web'

type Props = {
  onPress: () => void,
}

export default class AppInstallModal extends Component {
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
    backgroundColor: '#db0b56',
    width: 180,
    borderRadius: 3,
  },
  installAppText: {
    textAlign: 'center',
    color: '#ffffff',
  },
})
