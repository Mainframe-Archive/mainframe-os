// @flow

import React, { Component, type ElementRef } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import styled from 'styled-components/native'
import type { AppInstalledData } from '@mainframe/client'

import { Text, Button } from '@morpheus-ui/core'

import PlusIcon from '@morpheus-ui/icons/PlusSymbolCircled'

import Avatar from '../../UIComponents/Avatar'

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
  margin: 10px 0;
  padding: 30px 25px;
  background-color: ${props => props.theme.colors.LIGHT_GREY_F9};
  border-left-width: 5px;
  border-left-style: solid;
  border-left-color: ${props => props.theme.colors.PRIMARY_BLUE};
  border-radius: 3px;
  flex-direction: row;
  align-items: center;
`

const Profile = styled.View`
  flex: 1;
  margin-left: 15px;
`

const ButtonContainer = styled.View`
  margin-top: 15px;
  align-items: flex-end;
`

class IdentitiesView extends Component<Props> {
  renderUsers(): Array<ElementRef<any>> {
    const identities = [
      ...this.props.identities.ownUsers.map((user: User) => ({
        ...user,
        type: 'user',
      })),
      ...this.props.identities.ownDevelopers.map((user: User) => ({
        ...user,
        type: 'developer',
      })),
    ]

    return identities.map((user: Object) => {
      return (
        <UserItem key={user.localID}>
          <Avatar size="medium" id={user.localID} />
          <Profile>
            <Text variant="bold">{user.profile.name}</Text>
            <Text theme={{ color: '#585858', fontSize: '11px' }}>
              {user.feedHash}
            </Text>
          </Profile>
          <Text theme={{ color: '#585858', fontSize: '11px' }}>
            {user.type}
          </Text>
        </UserItem>
      )
    })
  }
  render() {
    return (
      <>
        <Text variant="smallTitle">Indentities</Text>
        {this.renderUsers()}
        <ButtonContainer>
          <Button variant="completeOnboarding" Icon={PlusIcon} title="New" />
        </ButtonContainer>
      </>
    )
  }
}

export default createFragmentContainer(IdentitiesView, {
  identities: graphql`
    fragment IdentitiesView_identities on IdentitiesQuery {
      ownUsers {
        localID
        feedHash
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
