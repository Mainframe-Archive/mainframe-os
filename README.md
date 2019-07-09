# Mainframe OS

A platform for easily building and running distributed, unstoppable apps.

## Overview

The main components (packages) of the Mainframe Platform are as follows:

- `daemon`: a background daemon process that communicates with decentralized services
- `launcher`: the Mainframe application installing, launching and running sandboxed apps

In addition, there are several auxiliary packages:

- `app-manifest`: an utility library for app manifests creation an validation
- `app-permissions`: an utility library for distributed app permissions
- `cli`: a command-line interface to communicate with the daemon
- `client`: a library used by the CLI & launcher to communicate with the daemon
- `config`: shared configuration utilities used by several packages
- `data-types`: shared data primitives
- `toolbox`: a set of functions that both the launcher and the cli use

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

Next, a local environment must be created. An environment contains references to all the vaults created and stores the downloaded application contents. To create a new environment, run the following command:

```
packages/cli/bin/run env:create
```

Or on Windows

```
"packages/cli/bin/run.cmd" env:create
```

This first environment should be created with the `development` type and set as default environment.

## Development

### Building the code

Whenever code changes in any other package than the launcher, you should build everything (via `lerna`) with:

```
yarn run build
```

Then, build dependencies:

```
cd packages/launcher && yarn deps:build
```

Then, start the OS:

```
MAINFRAME_ENV=<your_env_name> yarn run dev
```

### Building Mainframe Apps

Information and guides for building MainframeOS apps can be found in our [developer docs](https://docs.mainframe.com/docs/build-dapps).
