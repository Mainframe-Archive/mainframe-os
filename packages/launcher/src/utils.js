// @flow
import web3Utils from 'web3-utils'

export const truncateAddress = (address: string): string => {
  if (web3Utils.isAddress(address)) {
    const length = address.length
    const start = address.slice(0, 8)
    const end = address.slice(length - 5, length)
    return start + '...' + end
  }
  return address
}
