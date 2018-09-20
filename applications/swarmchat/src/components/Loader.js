// @flow

import React from 'react'
import { ActivityIndicator, View } from 'react-native-web'

import sharedStyles, { COLORS } from './styles'

const Loader = () => (
  <View style={sharedStyles.viewCenter}>
    <ActivityIndicator color={COLORS.BLUE_SWARM} size="large" />
  </View>
)

export default Loader
