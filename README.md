# Mainframe Platform

A platform for the new decentralized web. Makes building and running distributed, unstoppable apps easier.

## Overview

The main components (packages) of the Mainframe Browser are as follows:

- `daemon`: a background daemon process that communicates with decentralized services
- `launcher`: a front-end browser-like app launcher (powered by electron)

In addition, there are several auxiliary packages:

- `app-permissions`: a utility library for distributed app permissions
- `cli`: a command-line interface to communicate with the daemon
- `client`: a library used by the CLI & launcher to communicate with the daemon
- `config`: shared configuration utilities used by several packages
- `toolbox`: a set of functions that both the launcher and the cli use

In order to make it easier to share code among packages, this project uses [lerna](https://lernajs.io/). Whenever code changes, it's expected that you run `yarn build` from the root of the project directory, and it will kick off the necessary `lerna` build processes in the package folders.

## Getting Started

Each package contains (or will contain) a readme with further information pertaining to setup. A shortcut guide is as follows:

In the root of the project, install node dependencies:

```
$ yarn install
$ yarn bootstrap
```

Next, set up the daemon using the CLI:

```
$ packages/cli/bin/run env:create
$ packages/cli/bin/run daemon:setup --bin-path=$(pwd)/packages/daemon/bin/run
```

## Run

Whenever code changes in more than one package, you should build everything (via `lerna`) with:

```
yarn build
```

Now, in one terminal tab, run the daemon:

```
(cd packages/cli && ./bin/run daemon:start)
```

Then, in another tab, run the launcher:

```
(cd packages/launcher && yarn dev)
```

## Troubleshooting

There are several places to look when errors arise initially or during development. Here is an overview:

- if the Launcher won't start, look to the terminal logs where you ran `yarn dev`. Some javascript errors could prevent Electron from showing a window.
- if there are problems inside the launcher or apps, you can use the regular Chrome debugger (cmd-option-I) to view logs and diagnose issues.
- the daemon also shows errors in the terminal, and you can enable more verbose logging by setting the `DEBUG="*"` environment variable, e.g. `DEBUG="*" ./bin/run daemon:start`
