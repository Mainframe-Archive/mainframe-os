// @flow

import React, { Component } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import styled from 'styled-components/native'
import type { AppInstalledData } from '@mainframe/client'

import { Text, Button } from '@morpheus-ui/core'

import applyContext, { type CurrentUser } from '../LauncherContext'
import Avatar from '../../UIComponents/Avatar'
import InfoIcon from '../../UIComponents/Icons/InfoIcon'
import IdentityEditModal from './IdentityEditModal'

export type User = {
  localID: string,
  feedHash: string,
  discoverable?: boolean,
  profile: {
    name: string,
  },
  apps: Array<AppInstalledData>,
}

export type Identities = {
  ownUsers: Array<User>,
  ownDevelopers: Array<User>,
}

type RendererProps = {
  user: CurrentUser,
}

type Props = RendererProps & {
  identities: Identities,
}

type State = {
  editUser?: ?User,
}

const Container = styled.View`
  flex: 1;
  padding: 40px 50px 20px 50px;
`

const UserItem = styled.View`
  margin-bottom: 10px;
  padding: 20px;
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

const InfoBox = styled.View`
  margin-top: 20px;
  margin-bottom: 30px;
  padding: 10px 15px;
  max-width: 340px;
  border-width: 1px;
  border-color: #00a7e7;
  border-radius: 3px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  ${props => props.full && `max-width: auto;`}
`

export const InformationBox = ({ full }: { full?: boolean }) => {
  return (
    <InfoBox full={full}>
      <InfoIcon width={36} height={18} color="#00A7E7" />
      <Text size={12} color="#00A7E7" variant="marginLeft15">
        Share your Mainframe ID with your contacts and let your friends add you
        on Mainframe OS
      </Text>
    </InfoBox>
  )
}

class IdentitiesView extends Component<Props, State> {
  state = {}

  openEditModal = (user: User) => {
    this.setState({ editUser: user })
  }

  closeModal = () => {
    this.setState({ editUser: null })
  }

  renderUser(user: User, hideEdit?: boolean) {
    const onPress = () => this.openEditModal(user)
    return (
      <UserItem key={user.feedHash}>
        <Avatar size="medium" id={user.feedHash || user.localID} />
        <Profile>
          <Text variant="bold" color="#232323">
            {user.profile.name}
          </Text>
          {user.feedHash ? (
            <Text color="#585858" size={11}>
              Mainframe ID:{' '}
              <Text variant="mono" color="#585858" size={11}>
                {user.feedHash}
              </Text>
            </Text>
          ) : null}
        </Profile>
        {!hideEdit && (
          <Button
            onPress={onPress}
            variant={['small', 'completeOnboarding']}
            title="EDIT"
          />
        )}
      </UserItem>
    )
  }

  renderModal() {
    return this.state.editUser ? (
      <IdentityEditModal
        onClose={this.closeModal}
        ownUserIdentity={this.state.editUser}
      />
    ) : null
  }

  render() {
    const userData = this.props.identities.ownUsers.find(
      u => u.localID === this.props.user.localID,
    )
    return (
      <Container>
        {this.props.identities.ownUsers.length > 0 && (
          <Text variant={['smallTitle', 'blue', 'bold']}>Personal</Text>
        )}
        {userData && this.renderUser(userData)}
        <InformationBox />
        {this.props.identities.ownDevelopers.length > 0 && (
          <>
            <Text variant={['smallTitle', 'blue', 'bold']}>Developer</Text>
            {this.renderUser(this.props.identities.ownDevelopers[0], true)}
          </>
        )}
        {this.renderModal()}
      </Container>
    )
  }
}

export const IdentitiesViewRelayContainer = createFragmentContainer(
  IdentitiesView,
  {
    identities: graphql`
      fragment IdentitiesView_identities on Identities {
        ownUsers {
          ...IdentityEditModal_ownUserIdentity
          localID
          feedHash
          profile {
            name
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
  },
)

export default applyContext(IdentitiesViewRelayContainer)
