//@flow

import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native-web'

import Button from '../UIComponents/Button'
import MFTextInput from '../UIComponents/TextInput'
import Text from '../UIComponents/Text'
import OnboardContainer from '../UIComponents/OnboardContainer'
import colors from '../colors'

import rpc from './rpc'

type Props = {
  onIdentityCreated: (id: string) => void,
}

type State = {
  error?: ?string,
  name: string,
  awaitingResponse?: boolean,
}

export default class OnboardIdentityView extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      name: '',
    }
  }

  onPressCreateIdentity = () => {
    const { name } = this.state
    if (!name.length) {
      this.setState({
        error: 'Please provide a name',
      })
      return
    }
    this.setState({
      error: null,
      awaitingResponse: true,
    })
    this.createIdentity(name)
  }

  async createIdentity(name: string) {
    try {
      const res = await rpc.createUserIdentity({ name })
      this.props.onIdentityCreated(res.id)
    } catch (err) {
      this.setState({
        error: err.message,
        awaitingResponse: false,
      })
      // eslint-disable-next-line no-console
      console.warn(err)
    }
  }

  onChangeName = (value: string) => {
    this.setState({
      name: value,
    })
  }

  render() {
    const errorMsg = this.state.error ? (
      <Text style={styles.errorLabel}>{this.state.error}</Text>
    ) : null
    const action = this.state.awaitingResponse ? (
      <ActivityIndicator />
    ) : (
      <Button
        title="Create Identity"
        testID="onboard-create-identity-button"
        onPress={this.onPressCreateIdentity}
      />
    )
    return (
      <OnboardContainer
        title="Create an Identity"
        description="This is personal information that can be selectively shared with your contacts.">
        <View style={styles.container}>
          <MFTextInput
            style={styles.input}
            onChangeText={this.onChangeName}
            value={this.state.name}
            placeholder="Name"
            testID="onboard-create-identity-input-name"
          />
          {errorMsg}
          {action}
        </View>
      </OnboardContainer>
    )
  }
}

const PADDING = 10

const styles = StyleSheet.create({
  input: {
    marginBottom: PADDING * 2,
  },
  errorLabel: {
    fontSize: 14,
    paddingBottom: PADDING,
    color: colors.PRIMARY_RED,
  },
})
