//@flow

import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native-web'

import { COLORS } from './styles'

type Props = {
  onPress: () => any,
  title: string,
  disabled?: boolean,
}

export default class AppInstallModal extends Component<Props> {
  render() {
    return (
      <TouchableOpacity
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
    borderRadius: 3,
    maxWidth: 200,
  },
  label: {
    textAlign: 'center',
    color: COLORS.white,
  },
})
