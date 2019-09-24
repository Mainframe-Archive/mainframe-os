# Mainframe OS

A platform for easily building and running distributed, unstoppable apps.

## Overview

This repository is a desktop application based on Electron, producing the Mainframe OS binaries for Linux, macOS and Windows.

Other repositories contain specific parts of logic:

- [`mainframe-contracts`](https://github.com/MainframeHQ/mainframe-contracts): Ethereum smart contracts for contacts discovery
- [`mainframe-eth`](https://github.com/MainframeHQ/mainframe-eth): custom Ethereum client used by Mainframe OS
- [`mainframe-sdk`](https://github.com/MainframeHQ/mainframe-sdk): Mainframe SDK used by apps to interact with Mainframe OS

## Project Status

This project is in alpha, lots of breaking changes are to be expected between releases. It is using libraries and services that are themselves still in early stages of development. The cryptography and overall security have not been audited, no guarantees should be expected from this project at this stage.

## Getting Started

### Prerequisites

- [Node](https://nodejs.org/en/) v10+
- [Yarn](https://yarnpkg.com/en/) v1.13+
- [git](https://git-scm.com/)

### Platform-specific dependencies

#### Linux

```
sudo apt install -y build-essential libsecret-1-dev libudev-dev libusb-1.0-0-dev
```

#### Windows

```
npm install --global --production windows-build-tools
```

### Setup

```
yarn install # install dependencies
yarn run deps:build # rebuild native dependencies for Electron
```

## Development

### Running the code

```
yarn run dev
```

### Building Mainframe apps

Information and guides for building Mainframe apps can be found in our [developer docs](https://docs.mainframeos.com/docs/build-dapps).

## License

MIT.\
See [LICENSE](LICENSE) file.
