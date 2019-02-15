---
id: build-dapps
title: Building Mainframe Apps
---

You can build a Mainframe app using any Web technology supported by Electron v2 (Chromium v61).

The Mainframe teams build apps using [React Native Web](https://github.com/necolas/react-native-web). You can see a sample setup in the reference apps, [Onyx Stats](/applications/onyx-stats) and [create-mainframe-dapp](https://github.com/MainframeHQ/create-mainframe-dapp).

### Morpheus UI
[Morpheus UI](https://github.com/MainframeHQ/morpheus-ui) is a React Native Web UI toolkit to make it easier for developers to build Mainframe app interfaces.

Available packages include @morpheus-ui/core, @morpheus-ui/fonts, @morpheus-ui/forms, and @morpheus-ui/icons.

[Install from NPM](https://www.npmjs.com/package/@morpheus-ui/core)

#### Sample Morpheus UI Usage:

```
import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from '@morpheus-ui/core'

//Import the fonts in your root component
import '@morpheus-ui/fonts'

function App() {
  return <Button title="Hello World" />
}

ReactDOM.render(<App />, document.querySelector('#app'))
```


## Mainframe SDK

Your app will need to use the [Mainframe SDK](https://github.com/MainframeHQ/mainframe-os/tree/master/packages/sdk) to interact with the daemon and get access to user data, blockchain interfaces, and integrated storage and communication services. You can view the available API's in the [SDK package](sdk.md).

#### Install from NPM
```
npm install @mainframe/sdk
```
[npm docs](https://www.npmjs.com/package/@mainframe/sdk)

#### Example SDK usage:

```
import MainframeSDK from '@mainframe/sdk'
const sdk = new MainframeSDK()
const res = await sdk.apiVersion()
```



## create-mainframe-dapp

Use [create-mainframe-dapp](create-mainframe-dapp.md) for easy setup with built-in integration with Morpheus UI and Mainframe SDK.
