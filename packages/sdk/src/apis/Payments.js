// @flow
import { type TXEventEmitter } from '@mainframe/eth'

import ClientAPIs from '../ClientAPIs'
import type MainrameSDK from '../index'
import type { PayContactParams } from '../types'

export default class PaymentAPIs extends ClientAPIs {
  _sdk: MainrameSDK

  constructor(sdk: MainrameSDK) {
    super(sdk._rpc)
    this._sdk = sdk
  }

  async payContact(params: PayContactParams): Promise<TXEventEmitter> {
    const { contactID, currency, value } = params
    let contact
    if (!contactID) {
      // $FlowFixMe Promise type
      contact = await this._sdk.contacts.selectContact()
    } else {
      contact = await this._sdk.contacts.getDataForContact(contactID)
    }
    if (!contact) {
      throw new Error('No contact selected')
    }
    if (!contact.data || !contact.data.profile.ethAddress) {
      throw new Error(`No ETH address found for contact: ${contact.id}`)
    }
    // TODO: Fetch 'from' address from trusted UI if none provided
    const accounts = await this._sdk.ethereum.getAccounts()
    if (!accounts || !accounts.length) {
      throw new Error(`No wallets found`)
    }
    const sendParams = {
      from: accounts[0],
      to: contact.data.profile.ethAddress,
      value,
    }
    switch (currency) {
      case 'MFT':
        return this._sdk.ethereum.sendMFT(sendParams)
      case 'ETH':
        return this._sdk.ethereum.sendETH(sendParams)
      default:
        throw new Error(`Unsupported currency type: ${currency}`)
    }
  }
}
