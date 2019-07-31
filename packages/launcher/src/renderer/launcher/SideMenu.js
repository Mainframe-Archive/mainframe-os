// @flow

import { Button } from '@morpheus-ui/core'
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
import { Route } from 'react-router-dom'
import styled from 'styled-components/native'

import SvgSelectedPointer from '../UIComponents/SVGSelectedPointer'
import { ROUTES } from './constants'
import RelayLoaderView from './RelayLoaderView'
import { EnvironmentContext } from './RelayEnvironment'
import rpc from './rpc'

import type { SideMenu_contacts as Contacts } from './__generated__/SideMenu_contacts.graphql'
import type { SideMenu_apps as Apps } from './__generated__/SideMenu_apps.graphql'

export type ScreenNames =
  | 'apps'
  | 'identities'
  | 'contacts'
  | 'wallets'
  | 'settings'
  | 'notifications'

type Props = {}

const MENU_ITEMS: Array<ScreenNames> = [
  'apps',
  // 'identities',
  'contacts',
  'wallets',
  // 'notifications',
  'settings',
]

const BUTTONS: Object = {
  apps: {
    title: 'Applications',
    icon: AppsIcon,
    activeIcon: AppsFilledIcon,
    path: ROUTES.APPS,
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
    path: ROUTES.CONTACTS,
  },
  wallets: {
    title: 'Wallets',
    icon: WalletsIcon,
    activeIcon: WalletsFilledIcon,
    path: ROUTES.WALLETS,
  },
  settings: {
    title: 'More',
    icon: SettingsIcon,
    activeIcon: SettingsFilledIcon,
    path: ROUTES.SETTINGS,
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
  subscription SideMenuContactsChangedSubscription {
    contactsChanged {
      viewer {
        id
        # contacts {
        #   invitesCount(userID: $userID)
        # }
      }
    }
  }
`

export default class SideMenu extends Component<Props> {
  _contactsChangedSub: Disposable

  static defaultProps = {
    notifications: [],
  }

  componentDidMount() {
    // TODO: create hook to handle subscription lifecycle
    // this._contactsChangedSub = requestSubscription(
    //   this.props.relay.environment,
    //   { subscription: CONTACTS_CHANGED_SUBSCRIPTION },
    // )
  }

  componentWillUnmount() {
    // this._contactsChangedSub.dispose()
  }

  hasNotifications(type: ScreenNames) {
    return false
    // const { apps, contacts } = this.props
    // switch (type) {
    //   case 'contacts':
    //     return contacts.invitesCount > 0
    //   case 'apps':
    //     return apps.updatesCount > 0
    //   default:
    //     return false
    // }
  }

  renderMenuItem(item: ScreenNames) {
    const data = BUTTONS[item]
    const notifications = this.hasNotifications(item)

    return (
      <Route key={item} path={data.path}>
        {({ history, match }) => (
          <MenuItem>
            <Button
              Icon={match ? data.activeIcon : data.icon}
              variant={match ? ['leftNav', 'leftNavActive'] : 'leftNav'}
              title={data.title}
              onPress={() => {
                history.push(data.path)
              }}
            />
            {match ? (
              <SelectedPointer>
                <SvgSelectedPointer />
              </SelectedPointer>
            ) : null}
            {<NotificationDot notifications={notifications} />}
          </MenuItem>
        )}
      </Route>
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
