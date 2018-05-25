//@flow

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
} from 'react-native-web'
import Button from '../Button'

type Props = {
  permissions: { string: string | Array<string> },
}

type State = {
  permissions?: {
    string: string,
  },
}

export default class PermissionsView extends Component<State, Props> {
  state: State = {}

  // HANDLERS

  onPressDone = () => {}

  // RENDER

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>App Permissions</Text>
        <Button title="Save Preferences" onPress={this.onPressDone} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  header: {
    paddingBottom: 20,
    fontSize: 20,
  },
})
