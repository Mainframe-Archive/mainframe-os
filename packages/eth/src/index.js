// @flow

export { default as ABI } from './abi'
export { default as BaseContract } from './Contracts/BaseContract'
export { default as ERC20 } from './Contracts/ERC20'
export { default as EthClient } from './Client'
export * from './types'
export * from './utils'

export const ETH_RPC_URLS = {
  WS: {
    ropsten: 'wss://ropsten.infura.io/ws/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    mainnet: 'wss://mainnet.infura.io/ws/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    kovan: 'wss://kovan.infura.io/ws/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    rinkeby: 'wss://rinkeby.infura.io/ws/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    goerli: 'wss://goerli.infura.io/ws/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    ganache: 'ws://localhost:8545',
  },
  HTTP: {
    ropsten: 'https://ropsten.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    mainnet: 'https://mainnet.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
    ganache: 'http://localhost:8545',
  },
}
