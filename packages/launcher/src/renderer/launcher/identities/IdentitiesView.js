// @flow

import React, { Component } from 'react'
import { View, type ElementRef } from 'react-native-web'
import { createFragmentContainer, graphql } from 'react-relay'
import styled from 'styled-components/native'
import type { AppInstalledData } from '@mainframe/client'

import { Text } from '@morpheus-ui/core'
import globalStyles from '../../styles'

type Wallet = {
  localID: string,
  accounts: Array<string>,
}

type User = {
  localID: string,
  profile: {
    name: string,
  },
  apps: Array<AppInstalledData>,
  wallets: Array<Wallet>,
}

export type Identities = {
  ownUsers: Array<User>,
  ownDevelopers: Array<User>,
}

type Props = {
  identities: Identities,
}

const UserItem = styled.View`
  margin: 10px;
  padding: 10px;
  background-color: ${props => props.theme.colors.LIGHT_GREY_F7};
`

const SectionContainer = styled.View`
  padding: 10px;
  background-color: ${props => props.theme.colors.WHITE};
`

const SectionHeader = styled.Text`
  padding-vertical: 5px;
`

class IdentitiesView extends Component<Props> {
  renderDevelopers(): Array<ElementRef> {
    return this.props.identities.ownDevelopers.map(u => {
      return <UserItem key={u.localID}>{this.renderProfile(u)}</UserItem>
    })
  }

  renderUserApps(user: User) {
    const apps: Array<ElementRef> = user.apps.map(a => {
      return (
        <View key={a.localID}>
          <Text>{a.manifest.name}</Text>
          <Text>{a.localID}</Text>
        </View>
      )
    })
    return (
      <View>
        <SectionHeader>Apps</SectionHeader>
        <SectionContainer>{apps}</SectionContainer>
      </View>
    )
  }

  renderProfile(user: User) {
    return (
      <View>
        <SectionHeader>Profile</SectionHeader>
        <SectionContainer>
          <Text>Name: {user.profile.name}</Text>
          <Text>ID: {user.localID}</Text>
        </SectionContainer>
      </View>
    )
  }

  renderWallets(user: User) {
    return (
      <View>
        <SectionHeader>Wallets:</SectionHeader>
        <SectionContainer>
          {user.wallets.map(w => {
            return (
              <View key={w.localID}>
                <Text>id: {w.localID}</Text>
                {w.accounts.map(a => {
                  return <Text key={a}>{a}</Text>
                })}
              </View>
            )
          })}
        </SectionContainer>
      </View>
    )
  }

  renderUsers(): Array<ElementRef> {
    return this.props.identities.ownUsers.map(u => {
      return (
        <UserItem key={u.localID}>
          {this.renderProfile(u)}
          {this.renderWallets(u)}
          {this.renderUserApps(u)}
        </UserItem>
      )
    })
  }
  render() {
    return (
      <View>
        <Text style={globalStyles.boldText}>Users</Text>
        {this.renderUsers()}
        <Text style={globalStyles.boldText}>Developers</Text>
        {this.renderDevelopers()}
      </View>
    )
  }
}

export default createFragmentContainer(IdentitiesView, {
  identities: graphql`
    fragment IdentitiesView_identities on IdentitiesQuery {
      ownUsers {
        localID
        profile {
          name
        }
        wallets {
          localID
          accounts
        }
        apps {
          localID
          manifest {
            name
          }
          users {
            settings {
              permissionsSettings {
                permissionsChecked
                grants {
                  BLOCKCHAIN_SEND
                }
              }
            }
          }
        }
      }
      ownDevelopers {
        localID
        profile {
          name
        }
      }
    }
  `,
})
