// @flow

import { Button } from '@morpheus-ui/core'
import MainframeLogoIcon from '@morpheus-ui/icons/MainframeLogoSm'
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'

import { useSubscription } from '../RelayEnvironment'
import RelayRenderer from '../RelayRenderer'
import rpc from '../rpc'

import type { SystemUpdateItem_systemUpdate as SystemUpdate } from './__generated__/SystemUpdateItem_systemUpdate.graphql'
import SettingsItem from './SettingsItem'

const UPDATE_STATE_CHANGED_SUBSCRIPTION = graphql`
  subscription SystemUpdateItemUpdateChangedSubscription {
    systemUpdateChanged {
      systemUpdate {
        ...SystemUpdateItem_systemUpdate
      }
    }
  }
`

type Props = {
  systemUpdate: SystemUpdate,
}

function Item({ systemUpdate }: Props) {
  useSubscription(UPDATE_STATE_CHANGED_SUBSCRIPTION)

  let button
  switch (systemUpdate.status) {
    case 'CHECKING':
      button = (
        <Button
          disabled
          title="CHEKING FOR UPDATE..."
          variant={['completeOnboarding', 'small']}
        />
      )
      break
    case 'UPDATE_AVAILABLE':
    case 'UPDATE_DOWNLOADING':
      button = (
        <Button
          disabled
          title="DOWNLOADING UPDATE..."
          variant={['completeOnboarding', 'small']}
        />
      )
      break
    case 'UPDATE_DOWNLOADED':
      button = (
        <Button
          onPress={() => rpc.installUpdate()}
          title="INSTALL UPDATE NOW"
          variant={['completeOnboarding', 'small']}
        />
      )
      break
    case 'IDLE':
    case 'ERROR':
    case 'NO_UPDATE':
    default:
      button = (
        <Button
          onPress={() => rpc.checkUpdate()}
          title="CHECK FOR UPDATES"
          variant={['completeOnboarding', 'small']}
        />
      )
  }

  return (
    <SettingsItem
      title={`Mainframe OS v${systemUpdate.currentVersion}`}
      Icon={MainframeLogoIcon}
      RightElement={() => button}
    />
  )
}

const RelayContainer = createFragmentContainer(Item, {
  systemUpdate: graphql`
    fragment SystemUpdateItem_systemUpdate on SystemUpdate {
      status
      currentVersion
      newVersion
    }
  `,
})

export default function SystemUpdateItem() {
  return (
    <RelayRenderer
      render={({ props }) => (props ? <RelayContainer {...props} /> : null)}
      query={graphql`
        query SystemUpdateItemQuery {
          systemUpdate {
            ...SystemUpdateItem_systemUpdate
          }
        }
      `}
    />
  )
}
