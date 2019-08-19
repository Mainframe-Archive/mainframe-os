# Mainframe OS

A platform for easily building and running distributed, unstoppable apps.

## Overview

Mainframe OS is made of the following packages:

- `os`: the Electron application containing the OS data, UI and logic.
- `sdk`: the Mainframe SDK, used by the apps to use the OS features.
- `eth`: the internal Ethereum client used by Mainframe OS.
- `smart-contracts`: the Ethereum smart contracts used by the OS.

In order to make it easier to share code among packages, this project uses [lerna](https://lernajs.io/). Whenever code changes, it's expected that you run `yarn run build` from the root of the project directory, and it will kick off the necessary `lerna` build processes in the package folders.

## Project Status

This project is in alpha, lots of breaking changes are to be expected between releases. It is using libraries and services that are themselves still in early stages of development. The cryptography and overall security have not been audited, no guarantees should be expected from this project at this stage.

## Getting Started

### Contributing

> see [contributing.md](contributing.md)

### Prerequisites

- [Node](https://nodejs.org/en/) v10.x and [Yarn](https://yarnpkg.com/en/) => v1.13
- Installed git and added to PATH environment variable

#### Platform-specific dependencies

##### Linux

```
sudo apt install -y libudev-dev libtool libusb-1.0-0-dev build-essential
```

##### Windows

```
npm install --global --production windows-build-tools
```

### Setup

Each package contains (or will contain) a readme with further information pertaining to setup. A shortcut guide is as follows:

In the root of the project, install node dependencies:

```
yarn install
yarn build
```

## Development

### Building the code

Whenever code changes in any other package than the launcher, you should build everything (via `lerna`) with:

```
yarn run build
```

### Building Mainframe Apps

Information and guides for building MainframeOS apps can be found in our [developer docs](https://docs.mainframe.com/docs/build-dapps).
