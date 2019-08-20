// @flow

import ethAddress from './ethAddress'

export type EthWalletHDData = {|
  localID: string,
  mnemonic: string,
  name: ?string,
  hdPath: string,
  activeAccounts: Array<{| index: number, address: string |}>,
|}

export default {
  title: 'Ethereum HD wallet',
  version: 0,
  type: 'object',
  properties: {
    localID: {
      type: 'string',
      primary: true,
    },
    mnemonic: {
      type: 'string',
      final: true,
    },
    name: {
      type: 'string',
    },
    hdPath: {
      type: 'string',
      default: `m/44'/60'/0'/0`,
    },
    activeAccounts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: {
            type: 'integer',
            minimum: 0,
          },
          address: ethAddress,
        },
      },
    },
  },
}
