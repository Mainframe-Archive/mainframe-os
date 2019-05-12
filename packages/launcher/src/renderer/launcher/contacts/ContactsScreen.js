// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import applyContext, { type CurrentUser } from '../LauncherContext'
import RelayLoaderView from '../RelayLoaderView'
import ContactsView, { type Wallets } from './ContactsView'

import type { ContactsView_contacts as Contacts } from './__generated__/ContactsView_contacts.graphql'

type QueryProps = {
  user: CurrentUser,
}

type Props = QueryProps & {
  contacts: {
    userContacts: Contacts,
  },
  wallets: Wallets,
}

type State = {
  data: Array<Object>,
}

class ContactsScreenComponent extends Component<Props, State> {
  static contextType = EnvironmentContext

  render() {
    return (
      // $FlowFixMe: injected fragment type
      <ContactsView
        user={this.props.user}
        contacts={this.props.contacts}
        wallets={this.props.wallets}
      />
    )
  }
}

const ContactsScreenRelayContainer = createFragmentContainer(
  ContactsScreenComponent,
  {
    contacts: graphql`
      fragment ContactsScreen_contacts on Contacts
        @argumentDefinitions(userID: { type: "String!" }) {
        ...ContactsView_contacts @arguments(userID: $userID)
      }
    `,
    wallets: graphql`
      fragment ContactsScreen_wallets on Wallets
        @argumentDefinitions(userID: { type: "String!" }) {
        ...ContactsView_wallets @arguments(userID: $userID)
      }
    `,
  },
)

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
              wallets {
                ...ContactsScreen_wallets @arguments(userID: $userID)
              }
            }
          }
        `}
        variables={{ userID: this.props.user.localID }}
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

export default applyContext(ContactsScreenRenderer)
