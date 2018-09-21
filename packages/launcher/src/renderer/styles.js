// @flow

import { StyleSheet } from 'react-native-web'

import colors from './colors'

export default StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  darkGreyText: {
    color: colors.GREY_DARK_48,
  },
  boldText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.PRIMARY_RED,
  },
})
