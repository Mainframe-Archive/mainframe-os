// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
import applyContext, { type CurrentUser } from '../LauncherContext'
import RelayLoaderView from '../RelayLoaderView'
import ContactsView from './ContactsView'

import type { ContactsView_contacts as Contacts } from './__generated__/ContactsView_contacts.graphql'

type QueryProps = {
  user: CurrentUser,
}

type Props = QueryProps & {
  contacts: {
    userContacts: Contacts,
  },
}

type State = {
  data: Array<Object>,
}

class ContactsScreenComponent extends Component<Props, State> {
  static contextType = EnvironmentContext

  render() {
    return (
      // $FlowFixMe: injected fragment type
      <ContactsView user={this.props.user} contacts={this.props.contacts} />
    )
  }
}

const ContactsScreenRelayContainer = createFragmentContainer(
  ContactsScreenComponent,
  {
    // contacts: graphql`
    //   fragment ContactsScreen_contacts on Contacts
    //     @argumentDefinitions(userID: { type: "String!" }) {
    //     ...ContactsView_contacts @arguments(userID: $userID)
    //   }
    // `,
  },
)

export class ContactsScreenRenderer extends Component<QueryProps> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query ContactsScreenQuery {
            # $userID: String!
            viewer {
              id
              # contacts {
              #   ...ContactsScreen_contacts @arguments(userID: $userID)
              # }
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
