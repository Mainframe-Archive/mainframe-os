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

export default class ContactsScreenRenderer extends Component<{}> {
  static contextType = EnvironmentContext

  render() {
    return (
      <ContactsView
        data={[
          {
            id: 'dhioauhdaio43jiojio43j43',
            name: 'Alice',
            status: 'sent',
          },

          {
            id: 'dakjdkadoiasd7da7sd7a8dasdasd',
            status: 'received',
          },
          {
            id: 'dlajdajdioajdoiaj53434j3oijoi',
            name: 'John',
            status: 'accepted',
          },
        ]}
        ignoreContact={contact => console.log('ignore contact', contact)}
        acceptContact={contact => console.log('accept contact', contact)}
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
