// @flow

import Transport from '@ledgerhq/hw-transport-node-hid'
import LedgerAppEth from '@ledgerhq/hw-app-eth'

const ITEMS_PER_PAGE = 10
const HD_PATH = "m/44'/60'/0'/"
let ledgerApp

const getLedgerApp = async (): Promise<LedgerAppEth> => {
  if (ledgerApp) {
    return ledgerApp
  }
  const transport = await Transport.create()
  ledgerApp = new LedgerAppEth(transport)
  return ledgerApp
}

export const getAddressAtIndex = async (params: {
  index: number,
}): Promise<string> => {
  const app = await getLedgerApp()
  const path = HD_PATH + params.index
  const account = await app.getAddress(path)
  return account.address
}

export const getAccounts = async (params: {
  from: number,
  to: number,
}): Promise<Array<string>> => {
  const app = await getLedgerApp()
  const accounts = []
  for (let i = params.from; i < params.to; i++) {
    const path = HD_PATH + i
    const account = await app.getAddress(path)
    accounts.push(account)
  }
  return accounts.map(a => a.address)
}

export const getAccountsByPage = async (params: {
  pageNum: number,
}): Promise<Array<string>> => {
  const from = (params.pageNum - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE
  const accounts = await getAccounts({ from, to })
  return accounts
}

export const signTransaction = async (
  accountIndex: number,
  txHex: string,
): Promise<{ r: string, s: string, v: string }> => {
  const app = await getLedgerApp()
  const path = HD_PATH + accountIndex
  return app.signTransaction(path, txHex)
}

export const signPersonalMessage = async (
  accountIndex: number,
  hexData: string,
): Promise<{ r: string, s: string, v: number }> => {
  const app = await getLedgerApp()
  const path = HD_PATH + accountIndex
  return app.signPersonalMessage(path, hexData)
}
