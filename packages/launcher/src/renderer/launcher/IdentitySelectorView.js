//@flow

import type { ID } from '@mainframe/client'
import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native-web'
import { QueryRenderer, graphql, commitMutation } from 'react-relay'

import { Button } from '@morpheus-ui/core'
import Text from '../UIComponents/Text'
import colors from '../colors'
import { EnvironmentContext } from './RelayEnvironment'

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
  errorMsg?: ?string,
}

export const createUserMutation = graphql`
  mutation IdentitySelectorViewCreateUserIdentityMutation(
    $input: CreateUserIdentityInput!
  ) {
    createUserIdentity(input: $input) {
      user {
        localID
        profile {
          name
        }
      }
      viewer {
        identities {
          ownUsers {
            profile {
              name
            }
          }
          ownDevelopers {
            profile {
              name
            }
          }
        }
      }
    }
  }
`

export const createDeveloperMutation = graphql`
  mutation IdentitySelectorViewCreateDeveloperIdentityMutation(
    $input: CreateDeveloperIdentityInput!
  ) {
    createDeveloperIdentity(input: $input) {
      user {
        localID
        profile {
          name
        }
      }
      viewer {
        identities {
          ownUsers {
            profile {
              name
            }
          }
          ownDevelopers {
            profile {
              name
            }
          }
        }
      }
    }
  }
`

class IdentitySelectorView extends Component<Props, State> {
  static contextType = EnvironmentContext

  state = {
    newName: '',
  }

  onPressCreateId = () => {
    this.createId()
  }

  createId = async () => {
    const mutation =
      this.props.type === 'user' ? createUserMutation : createDeveloperMutation

    const input = {
      profile: {
        name: this.state.newName,
      },
    }

    commitMutation(this.context, {
      mutation: mutation,
      variables: { input },
      onCompleted: ({ createDeveloperIdentity }) => {
        this.setState({ newName: '' })
        if (this.props.onCreatedId) {
          this.props.onCreatedId(createDeveloperIdentity.user.localID)
        }
      },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem creating your identity.'
        this.setState({
          errorMsg: msg,
        })
      },
    })
  }

  onChangeName = (value: string) => {
    this.setState({
      newName: value,
    })
  }

  render() {
    const header = `Select ${this.props.type} ID`

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
            viewer {
              identities {
                ownUsers {
                  localID
                  profile {
                    name
                  }
                }
                ownDevelopers {
                  localID
                  profile {
                    name
                  }
                }
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            // TODO: handle error
          } else if (props) {
            return (
              <IdentitySelectorView
                identities={props.viewer.identities}
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
          return null
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
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
