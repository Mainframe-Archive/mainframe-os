//@flow

import React, {
  createRef,
  Component,
  type Element,
  type ElementRef,
} from 'react'
import { View, StyleSheet, Text } from 'react-native-web'
import ReactModal from 'react-modal'

type Props = {
  onRequestClose: () => void,
  children?: ?Element<any>,
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

const COLOR_WHITE = '#ffffff'

const styles = StyleSheet.create({
  container: {
    maxWidth: 520,
    minWidth: 420,
    padding: 20,
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },
})
