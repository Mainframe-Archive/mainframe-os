//@flow

import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native-web'
import type { ID } from '@mainframe/utils-id'

import { client } from '../electronIpc.js'
import Button from '../Button'

type User = {
  id: ID,
  data: {
    name: string,
  },
}

type Props = {
  onSelectId: (id: ID) => void,
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

  componentDidMount() {
    this.getOwnUserIds()
  }

  async getOwnUserIds() {
    try {
      const res = await client.getOwnUserIdentities()
      this.setState({ users: res.users })
    } catch (err) {
      // TODO: Handle error
      console.warn(err)
    }
  }

  onPressCreateId = () => {
    this.createNewId()
  }

  createNewId = async () => {
    try {
      const res = await client.createUserIdentity({ name: this.state.newName })
      this.getOwnUserIds()
      this.setState({ newName: '' })
    } catch (err) {
      // TODO: Handle error
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
        <TouchableOpacity onPress={handler} style={styles.idRow} key={name}>
          <Text style={styles.nameLabel}>{name}</Text>
          <Text style={styles.idLabel}>{id}</Text>
        </TouchableOpacity>
      )
    }

    const idRows = this.state.users.map((user, index) => {
      const handler = () => this.props.onSelectId(user.id)
      return rowRender(user.id, user.data.name, handler)
    })

    const newIdForm = this.state.showCreateIdForm ? (
      <View>
        <TextInput />
      </View>
    ) : null
    return (
      <View>
        <Text style={styles.header}>{header}</Text>
        {idRows}
        <View style={styles.createIdContainer}>
          <Text>Create New Identity</Text>
          <View style={styles.createIdForm}>
            <TextInput
              style={styles.input}
              onChangeText={this.onChangeName}
              value={this.state.newName}
              placeholder="name"
            />
            <Button
              onPress={this.onPressCreateId}
              title="Create"
              disabled={!this.state.newName}
            />
          </View>
        </View>
      </View>
    )
  }
}

const COLOR_WHITE = '#ffffff'
const COLOR_GREY = '#eeeeee'
const COLOR_MED_GREY = '#757575'
const COLOR_GREY_BORDER = '#e7e7e7'

const styles = StyleSheet.create({
  idRow: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: COLOR_GREY,
    marginTop: 10,
    flexDirection: 'row',
  },
  nameLabel: {
    flex: 1,
  },
  idLabel: {
    color: COLOR_MED_GREY,
    fontSize: 11,
    fontStyle: 'italic',
  },
  createIdContainer: {
    padding: 12,
    borderWidth: 1,
    marginTop: 10,
    borderColor: COLOR_GREY_BORDER,
    backgroundColor: COLOR_WHITE,
  },
  createIdForm: {
    flexDirection: 'row',
    marginTop: 7,
  },
  input: {
    padding: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR_GREY_BORDER,
    marginRight: 15,
  },
})
