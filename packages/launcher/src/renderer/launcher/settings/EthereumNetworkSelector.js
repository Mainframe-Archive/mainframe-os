// @flow

import { ETH_RPC_URLS } from '@mainframe/eth'
import { DropDown, Text } from '@morpheus-ui/core'
import NetworkIcon from '@morpheus-ui/icons/NetworkSm'
import React, { useCallback, useMemo, useState } from 'react'
import {
  commitMutation,
  createFragmentContainer,
  graphql,
  type Environment,
} from 'react-relay'

import RelayRenderer from '../RelayRenderer'
import type { EthereumNetworkSelector_user as User } from './__generated__/EthereumNetworkSelector_user.graphql'
import SettingsItem from './SettingsItem'

const NETWORK_NAMES = {
  mainnet: 'Mainnet',
  ropsten: 'Testnet (Ropsten)',
  ganache: 'Ganache (localhost:8545)',
  custom: 'Custom (MFT transfers disabled)',
}

const setEthNetworkMutation = graphql`
  mutation EthereumNetworkSelectorSetEthNetworkMutation(
    $input: SetEthNetworkInput!
  ) {
    setEthNetwork(input: $input) {
      user: viewer {
        ...EthereumNetworkSelector_user
      }
    }
  }
`

type Props = {
  relay: {
    environment: Environment,
  },
  user: User,
}

function Selector(props: Props) {
  const [errorMessage, setErrorMessage] = useState('')

  const onChangeEthNetwork = useCallback((value: string) => {
    const networkKey = Object.keys(NETWORK_NAMES).find(
      key => NETWORK_NAMES[key] === value,
    )

    commitMutation(props.relay.environment, {
      mutation: setEthNetworkMutation,
      variables: {
        input: {
          // $FlowFixMe computed property
          url: ETH_RPC_URLS.WS[networkKey],
        },
      },
      onCompleted: (res, errors) => {
        if (errors) {
          setErrorMessage(
            errors[0].message || 'Error updating Ethereum network.',
          )
        }
      },
      onError: err => {
        setErrorMessage(err.message)
      },
    })
  }, [])

  const defaultNetwork = useMemo(() => {
    const networkKey = Object.keys(ETH_RPC_URLS.WS).find(
      key => ETH_RPC_URLS.WS[key] === props.user.ethURL,
    )
    return networkKey ? NETWORK_NAMES[networkKey] : NETWORK_NAMES.custom
  }, [props.user.ethURL])

  return (
    <>
      <SettingsItem
        title="Ethereum Network"
        Icon={NetworkIcon}
        RightElement={() => (
          <DropDown
            theme={{ minWidth: 150 }}
            label="Select"
            onChange={onChangeEthNetwork}
            options={[
              NETWORK_NAMES.mainnet,
              NETWORK_NAMES.ropsten,
              NETWORK_NAMES.ganache,
            ]}
            defaultValue={defaultNetwork}
          />
        )}
      />
      {errorMessage.length ? <Text variant="error">{errorMessage}</Text> : null}
    </>
  )
}

const RelayContainer = createFragmentContainer(Selector, {
  user: graphql`
    fragment EthereumNetworkSelector_user on User {
      ethURL
    }
  `,
})

export default function EthereumNetworkSelector() {
  return (
    <RelayRenderer
      render={({ props }) => (props ? <RelayContainer {...props} /> : null)}
      query={graphql`
        query EthereumNetworkSelectorQuery {
          user: viewer {
            ...EthereumNetworkSelector_user
          }
        }
      `}
    />
  )
}
