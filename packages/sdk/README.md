# Mainframe SDK

Javascript SDK for communicating with the Mainframe launcher and daemon.

```
import MainframeSDK from '@mainframe/sdk'
const sdk = new MainframeSDK()
const res = await sdk.apiVersion()
```

# API

### apiVersion()

Get the current api version of the Mainframe client.

**returns:** `Promise<string>`

## Contacts

### contacts.selectContacts()

Will present the user with a list of contacts to select from and returns an Array containing data for the selected contacts.

**returns:** Promise<Array<[Contact](#contact)>>

**Example:**

```
const contacts = await sdk.contacts.selectContacts()
```

### contacts.selectContact()

Will allow the user to only select a single contact from their list of contacts and return a data object for that contact. If no contact is selected it will return undefined.

**returns:** Promise<?[Contact](#contact)>

**Example:**

```
const contact = await sdk.contacts.selectContact()
```

### contacts.getDataForContacts(contactIDs: Array<string\>)

Allows you to fetch data for contacts your app has previously been approved to read data from. It's possible some contacts could return no data in the case where the user has deleted a contact or revoked permission.

**returns:** Promise<Array<[ExistingContact](#existing-contact)>>

**Example:**

```
const contacts = await sdk.contacts.getDataForContacts(['ue64gf93b'])
```

### contacts.getDataForContact(contactID: string)

A call to fetch data for a single contact your app has previously been approved to read data from.

**returns:** Promise<?[Contact](#contact)>

**Example:**

```
const contact = await sdk.contacts.getDataForContact('ue64gf93b')
```

### contacts.getApprovedContacts()

Fetches all the contacts your app has previously been approved to read data from.

**returns:** Promise<Array<[Contact](#contact)>>

**Example:**

```
const contact = await sdk.contacts.getApprovedContacts()
```

## Ethereum

API's for interacting with the Ethereum blockchain.

### ethereum.web3Provider

A getter for the MainframeOS web3Provider.

_Currently incompatible with Web3 versions bigger than 1.0.0-beta.37, see issue [#2266](https://github.com/ethereum/web3.js/issues/2266) for more info._

```
const web3 = new Web3(sdk.ethereum.web3Provider)
```

### ethereum.networkVersion

Returns a numeric string representing the Ethereum network ID. A few example values:

```
'1': Ethereum Main Network
'2': Morden Test network
'3': Ropsten Test Network
'4': Rinkeby Test Network
‘42’: Kovan Test Network
```

### ethereum.getDefaultAccount

Fetches the users default Ethereum address

**returns:** Promise<?string>

**Example:**

```
const account = await sdk.ethereum.getDefaultAccount()
```

### ethereum.on(eventName, value)

Provides a way to listen to events from the providers event emitter.

1. `accountsChanged`: returns updated accounts array.
1. `networkChanged`: returns updated network ID string.

**Example:**

```
sdk.ethereum.on('accountsChanged', accounts => {
  // Time to refresh state
})

```

### ethereum.sendETH()

Transfer ETH on Ethereum blockchain.

**Arguments**

1. `value: number`
1. `to: string`
1. `from: string`
1. `confirmations?: number`

**returns:** Promise<[Transaction EventEmitter](#transaction-eventEmitter)>

**Example:**

```
const params = {
  value: 500,
  from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
  to: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
}

await sdk.payments.sendETH(params)
  .on('hash', hash => ... )
  .on('mined', () => ... )
  .on('confirmed', () => ... )
  .on('error', error => ... )

```

### ethereum.sendMFT()

Transfer MFT on Ethereum blockchain.

**Arguments**

1. `value: number`
1. `to: string`
1. `from: string`
1. `confirmations?: number`

**returns:** Promise<[Transaction EventEmitter](#transaction-eventEmitter)>

**Example:**

```
const params = {
  value: 500,
  from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
  to: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
}

await sdk.payments.sendMFT(params)
  .on('hash', hash => ... )
  .on('mined', () => ... )
  .on('confirmed', () => ... )
  .on('error', error => ... )

```

### ethereum.sign(message: string, address: string)

Sign a message with a users Ethereum wallet.

**returns:** Promise<string>

**Example:**

```
const signedMsg = await sdk.ethereum.sign('hello', '0xcf8d1238198ad8b389666574f2d8bc411a4b39b6')

```

## Payments

Payment API's to facilitate transferring funds between users.

### payments.payContact()

Read events from the blockchain.

**Arguments**

1. `currency: 'MFT' | 'ETH'`
1. `value: number`
1. `contactID?: string`
1. `from?: string`

**returns:** Promise<[Transaction EventEmitter](#transaction-eventEmitter:)>

If no contact ID is provided the contact picker will be displayed by the trusted UI to allow the user to select a contact.

If no from address is provided the users default eth address will be used.

**Example:**

```
const params = {
  value: 500,
  currency: 'MFT',
}

const tx = await sdk.payments.payContact(params)
tx.on('hash', hash => ... )
  .on('mined', () => ... )
  .on('confirmed', () => ... )
  .on('error', error => ... )


```

## Storage

### storage.promptUpload()

Will show a file upload window to the user, they can select one file they wish to upload.

**returns:** Promise<true> if the file was successfully uploaded, Promise<false> if the upload window was closed.

**Example:**

```
const key = 'example.jpg' // name that is going to be used in the app

await sdk.storage.promptUpload(key)
```

### storage.promptDownload()

Will show a save file window to the user, they can select where they wish to save the file.

**returns:** Promise<true> if the file was successfully saved, Promise<false> if the save window was closed.

**Example:**

```
const key = 'example.jpg' // key of the file user wants to download

await sdk.storage.promptDownload(key)
```

### storage.list()

Fetches keys for all the files your app has previously uploaded.

**returns:** Promise<Array<{ contentType: string, key: string }>>

**Example:**

```
const list = await sdk.storage.list()
```

### storage.set()

Sets a string value for a given key.

**returns:** Promise<?string>

**Example:**

```
const key = 'my-key'
const data = 'example data'

await sdk.storage.set(key, data)
```

### storage.get()

Fetches a string value for a given key.

**returns:** Promise<?string>

**Example:**

```
const key = 'my-key'

const data = await sdk.storage.get(key)
```

### storage.delete()

Deletes the key from the list of files available to the app.

**returns:** Promise<void>

**Example:**

```
const key = 'my-key'

const data = await sdk.storage.delete(key)
```

## Types

### Contact:

```
{
  id: string,
  data: {
    profile: {
      name: string,
      avatar?: string,
      ethAddress?: string,
    }
  }
}
```

### Existing Contact:

Optional data field where a contact might have been removed or revoked access.

```
{
  id: string,
  data: ?{
    profile: {
      name: string,
      avatar?: string,
      ethAddress?: string,
    }
  }
}
```

### Transaction EventEmitter:

Event Emitter returned by calls that write to the blockchain.
Will emit the following events:

**Event 1:** `hash`

When the transaction has been sent and includes the transaction hash.

**Event 2:** `mined`

Once the transaction has been mined.

**Event 3:** `confirmed`

Once the transaction has reached the required number of confirmations.

**Error:** `error`

Emitted on error.
