// @flow

import React from 'react'
import { StyleSheet, Text, View } from 'react-native-web'

import { COLORS } from './styles'

const styles = StyleSheet.create({
  view: {
    marginBottom: 5,
  },
  text: {
    color: COLORS.TEXT_ERROR,
    fontWeight: 'bold',
  },
})

type Props = {
  message?: ?string,
}

const FormError = ({ message }: Props) => {
  return message ? (
    <View style={styles.view}>
      <Text style={styles.text}>{message}</Text>
    </View>
  ) : null
}

export default FormError
