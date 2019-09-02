---
id: create-mainframe-dapp
title: create-mainframe-dapp
sidebar_label: create-mainframe-dapp
---

[create-mainframe-dapp](https://github.com/MainframeHQ/create-mainframe-dapp) is a bootstrapping tool to streamline the initial setup process for a new dapp. Projects started with create-mainframe-dapp will already include Morpheus UI and Mainframe SDK intergrations, and are structured and configured as needed to be installed in Mainframe OS.

> This guide assumes some familiarity with React development.

### Prerequisites

- [Node](https://nodejs.org/en/) v10.x and npm v6.x
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) v1.13.x
- Installed git and added to PATH environment variable

#### Fork create-mainframe-dapp

- [Fork the create-mainframe-dapp](https://github.com/MainframeHQ/create-mainframe-dapp/fork) repo
- `cd create-mainframe-dapp`
- `yarn`
- `yarn build`
- `yarn start`
- [Add and Run app to Mainframe OS](https://docs.mainframe.com/docs/introduction/#create-a-dapp)

> **Note:** If you try to open your new dapp in a standard browser (e.g. Chrome), you will get the following error: `Error: Cannot find expected mainframe client instance`. Dapps that integrate with the Mainframe SDK can only be opened in Mainframe OS. See instructions below.

This project contains a react based example dapp. It is configured for development within our electron environment and integrated with the Mainframe SDK out of the box.
