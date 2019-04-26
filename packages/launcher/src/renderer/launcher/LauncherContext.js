// @flow

import React, { createContext, type ElementRef } from 'react'
import { type EthClient } from '@mainframe/eth'

import type { Launcher_identities } from './__generated__/Launcher_identities.graphql'

type OwnUsers = $PropertyType<Launcher_identities, 'ownUsers'>
export type CurrentUser = $Call<<T>($ReadOnlyArray<T>) => T, OwnUsers>
export type ContextProps = {
  user: CurrentUser,
  ethClient: EthClient,
}

export const LauncherContext = createContext<ContextProps>({})

export const { Consumer, Provider } = LauncherContext

export default (Component: ElementRef<any>) => {
  return function WrappedComponent(props: any) {
    return <Consumer>{value => <Component {...props} {...value} />}</Consumer>
  }
}
