//@flow

import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native-web'

import { COLORS } from '../styles'

type Props = {
  onPress: () => void,
  testID?: string,
  title: string,
  disabled?: boolean,
}

export default class AppInstallModal extends Component<Props> {
  render() {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={styles.button}
        onPress={this.props.onPress}
        disabled={this.props.disabled}>
        <Text style={styles.label}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    backgroundColor: COLORS.red,
    paddingHorizontal: 30,
    borderRadius: 30,
    maxWidth: 200,
  },
  label: {
    textAlign: 'center',
    color: COLORS.white,
  },
})
