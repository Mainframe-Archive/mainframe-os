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

## Blockchain

A set of calls that enable interaction with the Ethereum blockchain.

### blockchain.web3Provider

A getter for the MainframeOS web3Provider.

_Currently incompatible with Web3 versions bigger than 1.0.0-beta.37, see issue [#2266](https://github.com/ethereum/web3.js/issues/2266) for more info._

```
const web3 = new Web3(sdk.blockchain.web3Provider)
```

### blockchain.sendETH()

Transfer ETH on Ethereum blockchain.

**Arguments**

1. `value: number`
1. `to: string`
1. `from: string`
1. `confirmations?: number`

**returns:** [Transaction EventEmitter](#Transaction EventEmitter)

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

### blockchain.sendMFT()

Transfer MFT on Ethereum blockchain.

**Arguments**

1. `value: number`
1. `to: string`
1. `from: string`
1. `confirmations?: number`

**returns:** [Transaction EventEmitter](#Transaction EventEmitter)

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

## Payments

Payment API's to facilitate transferring funds between users.

### payments.payContact()

Read events from the blockchain.

**Arguments**

1. `currency: 'MFT' | 'ETH'`
1. `value: number`
1. `contactID?: string`
1. `from?: string`

**returns:** Promise<[Transaction EventEmitter](#Transaction EventEmitter)>

If no contact ID is provided the contact picker will be displayed by the trusted UI to allow the user to select a contact.

If no from address is provided the users default eth address will be used.

**Example:**

```
const params = {
  value: 500,
  currency: 'MFT',
}

await sdk.payments.payContact(params)
  .on('hash', hash => ... )
  .on('mined', () => ... )
  .on('confirmed', () => ... )
  .on('error', error => ... )


```

## Transaction EventEmitter

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
