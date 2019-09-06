// @flow

import Transport from '@ledgerhq/hw-transport-node-hid'
import LedgerAppEth from '@ledgerhq/hw-app-eth'

let ledgerApp

const getPath = (index: number, legacyPath?: boolean) => {
  return legacyPath ? `m/44'/60'/0'/${index}` : `m/44'/60'/${index}'/0/0`
}

const getLedgerApp = async (): Promise<LedgerAppEth> => {
  if (ledgerApp) {
    return ledgerApp
  }
  const transport = await Transport.create()
  // eslint-disable-next-line require-atomic-updates
  ledgerApp = new LedgerAppEth(transport)
  return ledgerApp
}

export const getAddressAtIndex = async (
  index: number,
  legacyPath?: boolean,
): Promise<string> => {
  const app = await getLedgerApp()
  const path = getPath(index, legacyPath)
  const account = await app.getAddress(path)
  return account.address
}

export const getAccounts = async (
  from: number,
  to: number,
  legacyPath?: boolean,
): Promise<Array<string>> => {
  const app = await getLedgerApp()
  const accounts = []
  for (let i = from; i < to; i++) {
    const path = getPath(i, legacyPath)
    const account = await app.getAddress(path)
    accounts.push(account)
  }
  return accounts.map(a => a.address)
}

export const getAccountsByPage = async (
  pageNum: number,
  legacyPath: boolean,
  itemsPerPage: number = 5,
): Promise<Array<string>> => {
  const from = (pageNum - 1) * itemsPerPage
  const to = from + itemsPerPage
  const accounts = await getAccounts(from, to, legacyPath)
  return accounts
}

export const signTransaction = async (
  accountIndex: number,
  txHex: string,
  legacyPath?: boolean,
): Promise<{ r: string, s: string, v: string }> => {
  const app = await getLedgerApp()
  const path = getPath(accountIndex, legacyPath)
  return app.signTransaction(path, txHex)
}

export const signPersonalMessage = async (
  accountIndex: number,
  hexData: string,
  legacyPath?: boolean,
): Promise<{ r: string, s: string, v: number }> => {
  const app = await getLedgerApp()
  const path = getPath(accountIndex, legacyPath)
  return app.signPersonalMessage(path, hexData)
}
