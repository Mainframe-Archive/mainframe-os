---
id: build-dapps
title: Building Mainframe Dapps
---

### Building Mainframe dapps

You can build a Mainframe app using any Web technology supported by Electron v2 (Chromium v61).

The Mainframe teams build apps using [React Native Web](https://github.com/necolas/react-native-web), you can see a sample setup in the reference app, [Onyx Stats](/applications/onyx-stats) and [create-mainframe-dapp](https://github.com/MainframeHQ/create-mainframe-dapp). We are currently working on a UI Kit to make it easier for developers to build Mainframe app interfaces and will also be releasing a bootstrapping script to streamline the initial setup process.

Your app will need to use the [Mainframe SDK](packages/sdk) to interact with the daemon, you can view the available API's in the [SDK package](sdk.md).

Example SDK usage:

```
import MainframeSDK from '@mainframe/sdk'
const sdk = new MainframeSDK()
const res = await sdk.apiVersion()
```
