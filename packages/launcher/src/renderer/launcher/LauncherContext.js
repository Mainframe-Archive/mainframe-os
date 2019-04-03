// @flow

import React, { createContext, type ElementRef } from 'react'

import type { Launcher_identities } from './__generated__/Launcher_identities.graphql'

type OwnUsers = $PropertyType<Launcher_identities, 'ownUsers'>
export type CurrentUser = $Call<<T>($ReadOnlyArray<T>) => T, OwnUsers>

export const LauncherContext = createContext<{ user?: CurrentUser }>({})

export const { Consumer, Provider } = LauncherContext

export default (Component: ElementRef<any>) => {
  return function WrappedComponent(props: any) {
    return <Consumer>{value => <Component {...props} {...value} />}</Consumer>
  }
}
