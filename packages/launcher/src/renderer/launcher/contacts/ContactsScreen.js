/* eslint-disable no-console */
// @flow
import React, { Component } from 'react'
import {
  graphql,
  createFragmentContainer,
  commitMutation,
  QueryRenderer,
} from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import LauncherContext from '../LauncherContext'
import RelayLoaderView from '../RelayLoaderView'
import ContactsView, {
  type Contact,
  type SubmitContactInput,
} from './ContactsView'

type QueryProps = {
  userID: string,
}

type Props = QueryProps & {
  contacts: {
    userContacts: Array<Contact>,
  },
}

type State = {
  data: Array<Object>,
}

export const addContactMutation = graphql`
  mutation ContactsScreenAddContactMutation(
    $input: AddContactInput!
    $userID: String!
  ) {
    addContact(input: $input) {
      viewer {
        contacts {
          ...ContactsView_contacts @arguments(userID: $userID)
        }
      }
    }
  }
`

export class ContactsScreen extends Component<Props, State> {
  static contextType = EnvironmentContext
  state = {
    data: [],
  }

  addNewContact = (data: SubmitContactInput): Promise<Contact> => {
    const input = {
      userID: this.props.userID,
      publicFeed: data.feedHash,
      profile: {
        name: data.name,
      },
    }
    return new Promise((resolve, reject) => {
      commitMutation(this.context, {
        mutation: addContactMutation,
        variables: { input, userID: this.props.userID },
        onCompleted: (contact, errors) => {
          if (errors && errors.length) {
            reject(errors[0])
          } else {
            resolve(contact)
          }
        },
        onError: err => {
          reject(err)
        },
      })
    })
  }

  acceptContact = () => {
    // TODO needs implementing
  }

  ignoreContact = () => {
    // TODO needs implementing
  }

  render() {
    return (
      <ContactsView
        contacts={this.props.contacts}
        ignoreContact={this.ignoreContact}
        acceptContact={this.acceptContact}
        onSubmitNewContact={this.addNewContact}
      />
    )
  }
}

const ContactsScreenRelayContainer = createFragmentContainer(ContactsScreen, {
  contacts: graphql`
    fragment ContactsScreen_contacts on ContactsQuery
      @argumentDefinitions(userID: { type: "String!" }) {
      ...ContactsView_contacts @arguments(userID: $userID)
    }
  `,
})

export class ContactsScreenRenderer extends Component<QueryProps> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query ContactsScreenQuery($userID: String!) {
            viewer {
              contacts {
                ...ContactsScreen_contacts @arguments(userID: $userID)
              }
            }
          }
        `}
        variables={{ userID: this.props.userID }}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return (
              <ContactsScreenRelayContainer {...props.viewer} {...this.props} />
            )
          }
        }}
      />
    )
  }
}

export default class ContactsContextWrapper extends Component<{}> {
  static contextType = LauncherContext
  render() {
    return (
      <ContactsScreenRenderer userID={this.context.userID} {...this.props} />
    )
  }
}
