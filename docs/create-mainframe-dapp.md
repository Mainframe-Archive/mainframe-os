---
id: create-mainframe-dapp
title: create-mainframe-dapp
sidebar_label: create-mainframe-dapp
---

[`create-mainframe-dapp`](https://github.com/MainframeHQ/create-mainframe-dapp) is a bootstrapping tool to streamline the initial setup process for a new app.

Projects started with [`create-mainframe-dapp`](https://github.com/MainframeHQ/create-mainframe-dapp) integrate the [Mainframe SDK](sdk.md), and are structured and configured as needed to be installed in Mainframe OS.

## Prerequisites

- [Node](https://nodejs.org/en/) v10+
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) v1.13+
- [git](https://git-scm.com/)

## Installation

- [Fork the `create-mainframe-dapp` repository](https://github.com/MainframeHQ/create-mainframe-dapp/fork)
- `cd create-mainframe-dapp`
- `yarn`
- `yarn build`
- `yarn start`

## Next steps

Follow the instructions about adding and running your app in Mainframe OS in the [app development documentation](app-flow.md).

> **Note:** If you try to open your new app in a standard browser (e.g. Chrome), you will get the following error: `Error: Cannot find expected mainframe client instance`. Apps that integrate with the Mainframe SDK can only be opened in Mainframe OS. See instructions below.
