---
id: platform
title: Mainframe Platform
sidebar_label: Mainframe Platform
---


## Getting Started from Source

[Mainframe OS Github Repository](https://github.com/MainframeHQ/mainframe-os)
```
git clone https://github.com/MainframeHQ/mainframe-os.git
cd mainframe-os
git checkout release-v0.2
```



## Building the Project

### Prerequisites

- [Node](https://nodejs.org/en/) v10.x and npm v6.x
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) v1.13.x
- Installed git and added to PATH environment variable

### Platform Specific Instructions

[Windows Instructions](windows.md)

[Linux Dependencies](unix.md)

Mac & Unix Instructions - continue below

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

This first environment should be created with the `development` type and set as default environment.
The newly created environment then needs to be configured using the CLI:

```
packages/cli/bin/run daemon:setup --bin-path=./packages/daemon/bin/run
```

### Run Mainframe OS

In one terminal tab, run the daemon:

```
./packages/cli/bin/run daemon:start
```

Then, in another tab, run the launcher:

```
cd packages/launcher && yarn run dev
```



## Mainframe Platform Components

The main components (packages) of the Mainframe Platform are as follows:

- `daemon`: a background daemon process that communicates with decentralized services
- `launcher`: the Mainframe application installing, launching and running sandboxed apps

In addition, there are several auxiliary packages:

- `app-manifest`: a utility library for app manifests creation an validation
- `app-permissions`: a utility library for distributed app permissions
- `cli`: a command-line interface to communicate with the daemon
- `client`: a library used by the CLI & launcher to communicate with the daemon
- `config`: shared configuration utilities used by several packages
- `data-types`: shared data primitives
- `toolbox`: a set of functions that both the launcher and the cli use

In order to make it easier to share code among packages, this project uses [lerna](https://lernajs.io/). Whenever code changes, it's expected that you run `npm run build` from the root of the project directory, and it will kick off the necessary `lerna` build processes in the package folders.

## Troubleshooting

There are several places to look when errors arise initially or during development. Here is an overview:

- if the Launcher won't start, look to the terminal logs where you ran `npm run dev`. Some javascript errors could prevent Electron from showing a window.
- you can send all logs (including in-app `console.log` calls) to the terminal by starting electron with the `ELECTRON_ENABLE_LOGGING` environment variable, e.g. `ELECTRON_ENABLE_LOGGING=1 npm run dev`
- if there are problems inside the launcher or apps, you can use the regular Chrome debugger (cmd-option-I) to view logs and diagnose issues.
- the daemon also shows errors in the terminal, and you can enable more verbose logging by setting the `DEBUG="*"` environment variable, e.g. `DEBUG="*" ./packages/cli/bin/run daemon:start`

## Project Status

This project is in alpha, lots of breaking changes are to be expected between releases. It is using libraries and services that are themselves still in early stages of development. The cryptography and overall security have not been audited, no guarantees should be expected from this project at this stage.

## Contributing

See [github](https://github.com/MainframeHQ/mainframe-os/blob/master/contributing.md) for information on contributing to Mainframe OS.
