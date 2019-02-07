// @flow

import React, { createContext, type ElementRef } from 'react'

export type CurrentUser = {
  localID: string,
  defaultEthAddress: ?string,
}

export const { Consumer, Provider } = createContext<{ user?: CurrentUser }>({})

export default (Component: ElementRef<any>) => {
  return function WrappedComponent(props: any) {
    return <Consumer>{value => <Component {...props} {...value} />}</Consumer>
  }
}
