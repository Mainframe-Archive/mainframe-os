//@flow

import React, { Component, type Element, type Node } from 'react'
import { View, StyleSheet, Text } from 'react-native-web'
import ReactModal from 'react-modal'

import colors from './colors'

type Props = {
  onRequestClose: () => void,
  children?: ?Node,
}

export default class ModalView extends Component<Props> {
  render() {
    return (
      <ReactModal
        isOpen={true}
        onRequestClose={this.props.onRequestClose}
        {...this.props}>
        <View style={styles.container}>{this.props.children}</View>
      </ReactModal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 520,
    minWidth: 420,
    padding: 20,
    backgroundColor: colors.WHITE,
    flex: 1,
  },
})
