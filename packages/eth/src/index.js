// @flow

export { default as ABI } from './abi'
export * from './contractHelpers'
export { default as EthClient } from './Client'
export * from './types'

export const INFURA_URLS = {
  ropsten: 'https://ropsten.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
  mainnet: 'https://mainnet.infura.io/v3/8ec0911ee74c4583b1346bbc1afdf22d',
}
