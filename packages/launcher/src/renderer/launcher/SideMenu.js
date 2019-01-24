//@flow

import React, { Component } from 'react'

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

export type ScreenNames =
  | 'apps'
  | 'identities'
  | 'contacts'
  | 'wallets'
  | 'settings'
  | 'notifications'

type Props = {
  onSelectMenuItem: (name: ScreenNames) => void,
  selected: ScreenNames,
  notifications: Array<ScreenNames>,
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
    title: 'Settings',
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

export default class SideMenu extends Component<Props, State> {
  static defaultProps = {
    notifications: [],
  }

  onPressMenuItem = (name: ScreenNames) => {
    this.setState({
      selectedItem: name,
    })
    this.props.onSelectMenuItem(name)
  }

  renderMenuItem(item: ScreenNames) {
    const selected = this.props.selected === item
    const data = BUTTONS[item]
    const icon = selected ? data.activeIcon : data.icon
    const variant = selected ? ['leftNav', 'leftNavActive'] : 'leftNav'
    const notifications = this.props.notifications.indexOf(item) >= 0

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
