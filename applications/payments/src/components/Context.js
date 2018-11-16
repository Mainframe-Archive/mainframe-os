import React, { createContext } from 'react'
import type MainframeSDK from '@mainframe/sdk'
import type Web3 from 'web3'

export type ContextProps = {
  web3: Web3,
  sdk: MainframeSDK,
}

export const { Provider, Consumer } = createContext({
  web3: null,
  sdk: null,
})

export default Component => {
  return props => (
    <Consumer>{value => <Component {...props} {...value} />}</Consumer>
  )
}
