// @flow
import React, { Component } from 'react'
import { View, Image } from 'react-native-web'

import type { Style } from '../types'

type Props = {
  name: string,
  style?: Style,
  size?: number,
}

export default class Icon extends Component<Props> {
  render() {
    return (
      <View style={this.props.style}>
        <Image
          alt={this.props.name}
          source={{ uri: `/images/icons/${this.props.name}.svg` }}
          style={{ height: this.props.size, width: this.props.size }}
          resizeMode="contain"
        />
      </View>
    )
  }
}
