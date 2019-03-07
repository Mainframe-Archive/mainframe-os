// @flow

export { default as ABI } from './abi'
export { default as EthClient } from './Client'
export * from './types'
export * from './utils'

export const ETH_RPC_URLS = {
  WS: {
    ropsten: 'wss://ropsten.infura.io/ws',
    mainnet: 'wss://mainnet.infura.io/ws',
    ganache: 'ws://localhost:8545',
  },
  HTTP: {
    ropsten: 'https://ropsten.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    mainnet: 'https://mainnet.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    ganache: 'http://localhost:8545',
  },
}
