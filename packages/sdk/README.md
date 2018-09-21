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

### blockchain.getContractEvents()

Read events from the blockchain.

**Arguments**

1. `contractAddress: string`
1. `abi: Array<Object>`
1. `eventName: string`
1. `options: Object`

**returns:** `Promise<Response>`

```
const events = await sdk.blockchain.getContractEvents(
  contractAddress: '0xca29D79f9F427d4ea2aF5B41827e12f3C713C21e',
  abi: [
    {
      inputs: [],
      name: 'Paused',
      type: 'event'
    },
  ],
  eventName: 'Paused',
  options: {
    fromBlock: 5000000,
    toBlock: 5200000
  },
)
```

### blockchain.readContract()

Make a read only call to the blockchain.

**Arguments**

1. `contractAddress: string`
1. `abi: Array<Object>`
1. `method: string`
1. `args: Array<any>`

**returns:** `Promise<Response>`

```
const res = await sdk.blockchain.readContract(
  contractAddress: '0xca29D79f9F427d4ea2aF5B41827e12f3C713C21e',
  abi: [
    {
      constant: true,
      inputs: [
        {
          'name': '_owner',
          'type': 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
  ],
  method: 'balanceOf',
  args: ['0x5B191F5A2b4A867c4eD71858dacCc51FC59c69c0']
)
```

### blockchain.getLatestBlock()

Fetch the latest block from the blockchain.

**returns:** `Promise<number>`

```
const latestBlock = await sdk.blockchain.getLatestBlock()
```
