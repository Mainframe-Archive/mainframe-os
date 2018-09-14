// @flow

import { StyleSheet } from 'react-native-web'

const BLUE_SWARM = '#337ab7'
const GREY_DARK = '#333333'
const ORANGE_SWARM = '#ff8c00'
const RED_ERROR = '#d72323'
const WHITE = '#ffffff'

export const COLORS = {
  BLUE_SWARM,
  GREY_DARK,
  ORANGE_SWARM,
  RED_ERROR,
  WHITE,
  BACKGROUND: WHITE,
  BACKGROUND_CONTRAST: GREY_DARK,
  BUTTON_PRIMARY: ORANGE_SWARM,
  TEXT: GREY_DARK,
  TEXT_ALT: BLUE_SWARM,
  TEXT_CONTRAST: WHITE,
  TEXT_ERROR: RED_ERROR,
}

export default StyleSheet.create({
  viewCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
