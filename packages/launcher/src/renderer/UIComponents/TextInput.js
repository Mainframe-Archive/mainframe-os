//@flow

import React, { Component } from 'react'
import { TextInput, StyleSheet } from 'react-native-web'

import { type Style } from '../../types'
import colors from '../colors'

type Props = {
  style?: Style,
}

export default class MFTextInput extends Component<Props> {
  render() {
    const style = [styles.input, this.props.style]
    return (
      <TextInput
        placeholderTextColor={colors.GREY_MED_81}
        {...this.props}
        style={style}
      />
    )
  }
}

const styles = StyleSheet.create({
  input: {
    borderColor: colors.LIGHT_GREY_E8,
    borderRadius: 3,
    borderWidth: 1,
    flex: 1,
    fontFamily: 'Poppins',
    fontWeight: '300',
    padding: 10,
  },
})
