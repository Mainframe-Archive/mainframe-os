//@flow

import type { ID } from '@mainframe/client'
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native-web'
import { QueryRenderer, graphql } from 'react-relay'

import Button from '../UIComponents/Button'
import Text from '../UIComponents/Text'
import colors from '../colors'
import { EnvironmentContext } from './RelayEnvironment'

import rpc from './rpc'

type ContainerProps = {
  type: 'user' | 'developer',
  enableCreate?: boolean,
  onSelectId: (id: ID) => any,
  onCreatedId?: (id: ID) => any,
}

type Identity = {
  id: string,
  localID: string,
  profile: {
    name: string,
    avatar: string,
  },
}

type Props = ContainerProps & {
  identities: {
    ownUsers: Array<Identity>,
    ownDevelopers: Array<Identity>,
  },
}

type State = {
  newName: string,
  showCreateIdForm?: boolean,
}

class IdentitySelectorView extends Component<Props, State> {
  state = {
    newName: '',
  }

  onPressCreateId = () => {
    this.createId()
  }

  createId = async () => {
    try {
      let createIdentity
      switch (this.props.type) {
        case 'developer':
          createIdentity = rpc.createDeveloperIdentity
          break
        case 'user':
        default:
          createIdentity = rpc.createUserIdentity
      }
      const res = await createIdentity({
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
    const header = `Select ${this.props.type} ID`
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

    const idRows = Object.values(this.props.identities.ownUsers).map(user => {
      // $FlowFixMe mixed map type
      const handler = () => this.props.onSelectId(user.localId)
      // $FlowFixMe mixed map type
      return rowRender(user.localId, user.profile.name, handler)
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
        {createIdentity}
        <ScrollView>
          <View style={styles.scrollInner}>{idRows}</View>
        </ScrollView>
      </View>
    )
  }
}

export default class IdentitySelectorQueryContainer extends Component<ContainerProps> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query IdentitySelectorViewQuery {
            identities {
              ownUsers {
                localId
                profile {
                  name
                }
              }
              ownDevelopers {
                localId
                profile {
                  name
                }
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          /* eslint-disable no-console */
          if (error) {
            // TODO: handle error
          } else if (props) {
            return (
              <IdentitySelectorView
                identities={props.identities}
                type={props.type}
                {...this.props}
              />
            )
          } else {
            return (
              <View>
                <ActivityIndicator />
              </View>
            )
          }
          /* eslint-enable no-console */
          return null
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  scrollInner: {
    maxHeight: 260,
  },
  idRow: {
    padding: 10,
    borderRadius: 3,
    backgroundColor: colors.LIGHT_GREY_EE,
    marginTop: 10,
    flexDirection: 'column',
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
    marginVertical: 10,
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
