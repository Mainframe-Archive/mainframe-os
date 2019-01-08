/* eslint-disable no-console */
// @flow
import React, { Component } from 'react'
// import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'

import { EnvironmentContext } from '../RelayEnvironment'
// import RelayLoaderView from '../RelayLoaderView'
import ContactsView from './ContactsView'

// import ContactsView, { type Contacts } from './ContactsView'

// type RendererProps = {}

// type Props = RendererProps & {
//   apps: Contacts,
// }

// class ContactsScreen extends Component<Props> {
//   render() {
//     return <ContactsView apps={this.props.apps} />
//   }
// }

// const ContactsScreenRelayContainer = createFragmentContainer(ContactsScreen, {
//   apps: graphql`
//     fragment ContactsScreen_apps on ContactsQuery {
//       ...ContactsView_apps
//     }
//   `,
// })

type State = {
  data: Array<Object>,
}

export default class ContactsScreenRenderer extends Component<{}, State> {
  static contextType = EnvironmentContext
  state = {
    data: [],
  }

  adddNewContact = (contact: Object) => {
    this.setState({
      data: [...this.state.data, contact],
    })
  }
  render() {
    return (
      <ContactsView
        data={this.state.data}
        ignoreContact={contact => console.log('ignore contact', contact)}
        acceptContact={contact => console.log('accept contact', contact)}
        onSubmitNewContact={this.adddNewContact}
      />
    )
  }

  //   render() {
  //     return (
  //       <QueryRenderer
  //         environment={this.context}
  //         query={graphql`
  //           query ContactsScreenQuery {
  //             viewer {
  //               apps {
  //                 ...ContactsScreen_apps
  //               }
  //             }
  //           }
  //         `}
  //         variables={{}}
  //         render={({ error, props }) => {
  //           if (error || !props) {
  //             return <RelayLoaderView error={error ? error.message : undefined} />
  //           } else {
  //             return (
  //               <ContactsScreenRelayContainer {...props.viewer} {...this.props} />
  //             )
  //           }
  //         }}
  //       />
  //     )
  //   }
}
