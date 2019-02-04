// @flow

export type ContactID = string

export type PayContactParams = {
  contactID?: string,
  currency: 'ETH' | 'MFT',
  value: number,
  from?: ?string,
}

export type Contact = {
  id: ContactID,
  data: ?{
    profile: {
      name: string,
      avatar?: ?string,
      ethAddress?: ?string,
    },
  },
}
