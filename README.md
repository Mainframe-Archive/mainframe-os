# Mainframe Browser

A browser for the new decentralized web. Makes building and running distributed, unstoppable apps easier. Built with electron.

## Overview

The main components (packages) of the Mainframe Browser are as follows:

- `daemon`: a background daemon process
- `launcher`: a front-end browser (powered by electron)

In addition, there are several auxiliary packages:

- `app-permissions`: a grouping of permissions that can be granted to dapps
- `cli`: a command-line interface to communicate with the daemon
- `client`: a library used by the front-end to communicate with the daemon
- `config`: the configuration object that several components rely on
- `toolbox`: a set of functions that both the launcher and the cli use

In order to make it easier to share code among packages, this project uses [lerna](https://lernajs.io/). Whenever code changes, it's expected that you run `yarn build` from the root of the project directory, and it will kick off the necessary `lerna` build processes in the package folders.

## Getting Started
Each package contains (or will contain) a readme with further information pertaining to setup. A shortcut guide is as follows:

In the root of the project, install node dependencies:
```
$ yarn install
$ (cd packages/launcher; yarn install)
$ yarn bootstrap
```

Next, set up the daemon using the CLI:
```
$ cd packages/cli
$ ./bin/run env:create
$ ./bin/run daemon:setup --bin-path=../daemon/bin/run --socket-path=/tmp/mainframe.ipc
```

Currently it is necessary to create a vault with password `testKey`:
```
$ cd packages/cli
$ ./bin/run vault:create
? Vault label TestVault
? Vault passphrase (make it long!) testKey
? Vault passphrase (confirmation) testKey
? Set as default vault? Yes
New vault created at /Users/duane/Library/Preferences/mainframe-env-development-nodejs/vaults/XPQDK_i_VPrM6fvJas2ra
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
