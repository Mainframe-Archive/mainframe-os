// @flow
import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import LauncherContext from '../LauncherContext'
import RelayLoaderView from '../RelayLoaderView'
import ContactsView, { type Contact } from './ContactsView'

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

export class ContactsScreen extends Component<Props, State> {
  static contextType = EnvironmentContext

  acceptContact = () => {
    // TODO needs implementing
  }

  ignoreContact = () => {
    // TODO needs implementing
  }

  render() {
    return (
      <ContactsView
        userID={this.props.userID}
        contacts={this.props.contacts}
        ignoreContact={this.ignoreContact}
        acceptContact={this.acceptContact}
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
