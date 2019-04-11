//@flow

import React, { Component } from 'react'
import {
  graphql,
  QueryRenderer,
  createFragmentContainer,
  // $FlowFixMe: requestSubscription not present in Flow definition but exported by library
  requestSubscription,
  type Disposable,
  type Environment,
} from 'react-relay'

import { Button } from '@morpheus-ui/core'
import styled from 'styled-components/native'

//import Icons
import AppsIcon from '@morpheus-ui/icons/AppsMd'
import AppsFilledIcon from '@morpheus-ui/icons/AppsFilledMd'
import IdentityIcon from '@morpheus-ui/icons/IdentityMd'
import IdentityFilledIcon from '@morpheus-ui/icons/IdentityFilledMd'
import ContactsIcon from '@morpheus-ui/icons/ContactsMd'
import ContactsFilledIcon from '@morpheus-ui/icons/ContactsFilledMd'
import WalletsIcon from '@morpheus-ui/icons/WalletsMd'
import WalletsFilledIcon from '@morpheus-ui/icons/WalletsFilledMd'
import SettingsIcon from '@morpheus-ui/icons/SettingsMd'
import SettingsFilledIcon from '@morpheus-ui/icons/SettingsFilledMd'
import NotificationsIcon from '@morpheus-ui/icons/NotificationsMd'
import NotificationsFilledIcon from '@morpheus-ui/icons/NotificationsFilledMd'

import SvgSelectedPointer from '../UIComponents/SVGSelectedPointer'
import RelayLoaderView from './RelayLoaderView'
import { EnvironmentContext } from './RelayEnvironment'
import applyContext, { type CurrentUser } from './LauncherContext'

import type { SideMenu_contacts as Contacts } from './__generated__/SideMenu_contacts.graphql'
import type { SideMenu_apps as Apps } from './__generated__/SideMenu_apps.graphql'

export type ScreenNames =
  | 'apps'
  | 'identities'
  | 'contacts'
  | 'wallets'
  | 'settings'
  | 'notifications'

type QueryProps = {
  user: CurrentUser,
  onSelectMenuItem: (name: ScreenNames) => void,
  selected: ScreenNames,
}

type Props = QueryProps & {
  contacts: Contacts,
  apps: Apps,
  relay: {
    environment: Environment,
  },
}

type State = {
  selectedItem: ScreenNames,
}

const MENU_ITEMS: Array<ScreenNames> = [
  'apps',
  'identities',
  'contacts',
  'wallets',
  'notifications',
  'settings',
]

const BUTTONS: Object = {
  apps: {
    title: 'Applications',
    icon: AppsIcon,
    activeIcon: AppsFilledIcon,
  },
  identities: {
    title: 'Identities',
    icon: IdentityIcon,
    activeIcon: IdentityFilledIcon,
  },
  contacts: {
    title: 'Contacts',
    icon: ContactsIcon,
    activeIcon: ContactsFilledIcon,
  },
  wallets: {
    title: 'Wallets',
    icon: WalletsIcon,
    activeIcon: WalletsFilledIcon,
  },
  settings: {
    title: 'More',
    icon: SettingsIcon,
    activeIcon: SettingsFilledIcon,
  },
  notifications: {
    title: 'Notifications',
    icon: NotificationsIcon,
    activeIcon: NotificationsFilledIcon,
  },
}

const Container = styled.View`
  width: 126px;
  padding-top: 20px;
  background-color: ${props => props.theme.colors.LIGHT_GREY_F5};
`

const ScrollView = styled.ScrollView`
  padding: ${props => props.theme.spacing * 2}px;
`

const MenuItem = styled.View`
  padding: 10px 0 15px 0;
  align-items: center;
`

const NotificationDot = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 100%;
  background-color: ${props =>
    props.notifications ? props.theme.colors.PRIMARY_RED : 'transparent'};
  margin-top: 7px;
`

const SelectedPointer = styled.View`
  width: 21px;
  height: 42px;
  position: absolute;
  right: -21px;
  margin-top: -8px;
`

const CONTACTS_CHANGED_SUBSCRIPTION = graphql`
  subscription SideMenuContactsChangedSubscription($userID: String!) {
    contactsChanged {
      viewer {
        contacts {
          invitesCount(userID: $userID)
        }
      }
    }
  }
`

export class SideMenu extends Component<Props, State> {
  _contactsChangedSub: Disposable

  static defaultProps = {
    notifications: [],
  }

  componentDidMount() {
    this._contactsChangedSub = requestSubscription(
      this.props.relay.environment,
      {
        subscription: CONTACTS_CHANGED_SUBSCRIPTION,
        variables: {
          userID: this.props.user.localID,
        },
      },
    )
  }

  componentWillUnmount() {
    this._contactsChangedSub.dispose()
  }

  onPressMenuItem = (name: ScreenNames) => {
    this.setState({
      selectedItem: name,
    })
    this.props.onSelectMenuItem(name)
  }

  hasNotifications(type: ScreenNames) {
    const { apps, contacts } = this.props
    switch (type) {
      case 'contacts':
        return contacts.invitesCount > 0
      case 'apps':
        return apps.updatesCount > 0
      default:
        return false
    }
  }

  renderMenuItem(item: ScreenNames) {
    const selected = this.props.selected === item
    const data = BUTTONS[item]
    const icon = selected ? data.activeIcon : data.icon
    const variant = selected ? ['leftNav', 'leftNavActive'] : 'leftNav'

    const notifications = this.hasNotifications(item)

    return (
      <MenuItem key={item}>
        <Button
          Icon={icon}
          variant={variant}
          title={data.title}
          onPress={() => this.onPressMenuItem(item)}
        />
        {selected && (
          <SelectedPointer>
            <SvgSelectedPointer />
          </SelectedPointer>
        )}
        {<NotificationDot notifications={notifications} />}
      </MenuItem>
    )
  }

  render() {
    return (
      <Container>
        <ScrollView>{MENU_ITEMS.map(i => this.renderMenuItem(i))}</ScrollView>
      </Container>
    )
  }
}

const SideMenuRelayContainer = createFragmentContainer(SideMenu, {
  contacts: graphql`
    fragment SideMenu_contacts on Contacts
      @argumentDefinitions(userID: { type: "String!" }) {
      invitesCount(userID: $userID)
    }
  `,
  apps: graphql`
    fragment SideMenu_apps on Apps {
      updatesCount
    }
  `,
})

export class SideMenuRenderer extends Component<QueryProps> {
  static contextType = EnvironmentContext

  render() {
    return (
      <QueryRenderer
        environment={this.context}
        query={graphql`
          query SideMenuQuery($userID: String!) {
            viewer {
              apps {
                ...SideMenu_apps
              }
              contacts {
                ...SideMenu_contacts @arguments(userID: $userID)
              }
            }
          }
        `}
        variables={{ userID: this.props.user.localID }}
        render={({ error, props }) => {
          if (error || !props) {
            return <RelayLoaderView error={error ? error.message : undefined} />
          } else {
            return <SideMenuRelayContainer {...props.viewer} {...this.props} />
          }
        }}
      />
    )
  }
}

export default applyContext(SideMenuRenderer)
