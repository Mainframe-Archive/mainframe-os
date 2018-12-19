//@flow

import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import COLORS from '../colors'
import type { Style } from '../../types'
import Text from './Text'

type Props = {
  onPress: () => void | Promise<any>,
  testID?: string,
  title: string,
  disabled?: boolean,
  style?: Style,
  textStyle?: Style,
}

export default class AppInstallModal extends Component<Props> {
  render() {
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={[styles.button, this.props.style]}
        onPress={this.props.onPress}
        disabled={this.props.disabled}>
        <Text style={[styles.label, this.props.textStyle]}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    backgroundColor: COLORS.BRIGHT_BLUE,
    paddingHorizontal: 30,
    borderRadius: 30,
    maxWidth: 250,
    alignSelf: 'flex-start',
  },
  label: {
    textAlign: 'center',
    color: COLORS.WHITE,
    fontWeight: 'bold,',
  },
})
