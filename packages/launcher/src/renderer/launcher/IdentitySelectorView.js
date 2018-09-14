//@flow

import type { ID } from '@mainframe/client'
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native-web'

import Button from '../UIComponents/Button'
import Text from '../UIComponents/Text'
import colors from '../colors'

import rpc from './rpc'

type User = {
  id: ID,
  data: {
    name: string,
  },
}

type Props = {
  users: Array<User>,
  enableCreate?: boolean,
  onSelectId: (id: ID) => void,
  onCreatedId?: (id: ID) => void,
}

type State = {
  newName: string,
  users: Array<User>,
  showCreateIdForm?: boolean,
}

export default class IdentitySelectorView extends Component<Props, State> {
  state = {
    users: [],
    newName: '',
  }

  onPressCreateId = () => {
    this.createId()
  }

  async createId() {
    try {
      const res = await rpc.createUserIdentity({
        name: this.state.newName,
      })
      this.setState({ newName: '' })
      if (this.props.onCreatedId) {
        this.props.onCreatedId(res.id)
      }
    } catch (err) {
      // TODO: Handle error
      // eslint-disable-next-line no-console
      console.warn(err)
    }
  }

  onChangeName = (value: string) => {
    this.setState({
      newName: value,
    })
  }

  render() {
    const header = `Select User ID`
    const rowRender = (id, name, handler) => {
      return (
        <TouchableOpacity
          testID={`identity-selector-select-${name}`}
          onPress={handler}
          style={styles.idRow}
          key={id}>
          <Text style={styles.nameLabel}>{name}</Text>
          <Text style={styles.idLabel}>{id}</Text>
        </TouchableOpacity>
      )
    }

    const idRows = this.props.users.map(user => {
      const handler = () => this.props.onSelectId(user.id)
      return rowRender(user.id, user.data.name, handler)
    })

    const createIdentity = this.props.enableCreate ? (
      <View style={styles.createIdContainer}>
        <Text>Create New Identity</Text>
        <View style={styles.createIdForm}>
          <TextInput
            style={styles.input}
            onChangeText={this.onChangeName}
            value={this.state.newName}
            placeholder="name"
            testID="create-identity-input-name"
          />
          <Button
            onPress={this.onPressCreateId}
            title="Create"
            disabled={!this.state.newName}
            testID="create-identity-button-submit"
          />
        </View>
      </View>
    ) : null

    return (
      <View>
        <Text style={styles.header}>{header}</Text>
        {idRows}
        {createIdentity}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  idRow: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: colors.LIGHT_GREY_EE,
    marginTop: 10,
    flexDirection: 'row',
  },
  nameLabel: {
    flex: 1,
  },
  idLabel: {
    color: colors.GREY_MED_75,
    fontSize: 11,
    fontStyle: 'italic',
  },
  createIdContainer: {
    padding: 12,
    borderWidth: 1,
    marginTop: 10,
    borderColor: colors.LIGHT_GREY_E8,
    backgroundColor: colors.WHITE,
  },
  createIdForm: {
    flexDirection: 'row',
    marginTop: 7,
  },
  input: {
    padding: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.LIGHT_GREY_E8,
    marginRight: 15,
  },
})
