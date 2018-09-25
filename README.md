# Mainframe Platform

A platform for the new decentralized web. Makes building and running distributed, unstoppable apps easier.

## Overview

The main components (packages) of the Mainframe Browser are as follows:

- `daemon`: a background daemon process that communicates with decentralized services
- `launcher`: a front-end browser-like app launcher (powered by electron)

In addition, there are several auxiliary packages:

- `app-manifest`: an utility library for app manifests creation an validation
- `app-permissions`: an utility library for distributed app permissions
- `cli`: a command-line interface to communicate with the daemon
- `client`: a library used by the CLI & launcher to communicate with the daemon
- `config`: shared configuration utilities used by several packages
- `data-types`: shared data primitives
- `toolbox`: a set of functions that both the launcher and the cli use

In order to make it easier to share code among packages, this project uses [lerna](https://lernajs.io/). Whenever code changes, it's expected that you run `yarn build` from the root of the project directory, and it will kick off the necessary `lerna` build processes in the package folders.

## Getting Started

### Prerequisites

- [Node](https://nodejs.org/en/) v10+ (includes npm)
- [Yarn](https://yarnpkg.com/lang/en/) (optional - faster alternative to npm)

### Setup

Each package contains (or will contain) a readme with further information pertaining to setup. A shortcut guide is as follows:

In the root of the project, install node dependencies:

```
yarn install
yarn bootstrap
yarn build
```

Next, set up the daemon using the CLI:

```
packages/cli/bin/run env:create
packages/cli/bin/run daemon:setup --bin-path=./packages/daemon/bin/run
```

## Development

Whenever code changes in more than one package, you should build everything (via `lerna`) with:

```
yarn build
```

Now, in one terminal tab, run the daemon:

```
./packages/cli/bin/run daemon:start
```

Then, in another tab, run the launcher:

```
cd packages/launcher && yarn dev
```

### Building Mainframe Apps

We recommend to build your apps using [React Native Web](https://github.com/necolas/react-native-web), you can see a sample setup in the reference app, [Onyx Stats](/applications/onyx-stats). We are currently working on a UI Kit to make it easier for developers to build Mainframe app interfaces and will also be releasing a bootstrapping script to streamline the initial setup process.

Your app will need to use the [Mainframe sdk](packages/sdk) to interact with the daemon, you can view the available api's in the [sdk package](packages/sdk/README.md).

Example SDK usage:

```
import MainframeSDK from '@mainframe/sdk'
const sdk = new MainframeSDK()
const res = await sdk.apiVersion()
```

### Testing your App from the Launcher

The Launcher has a developer mode where you are be able to create, run and manage your apps. To access this dev mode you can use the toggle in the bottom left corner of the Launcher.

In developer mode, click the `Create new App` button to begin the app creation flow. You will then be guided through some steps to provide meta data for your app, link to your apps contents folder, create or select your developer identity and set any required permissions.

Once created, you should see your app displayed in the launcher, clicking it should open it in a new window and load your app contents.

**_Editing your app details from the launcher is currently not supported, if you'd like to amend your app metadata or permissions once it's been created, you can use the CLI or simply delete and recreate your app._**

#### Debugging with Chrome dev tools

Apps run inside a sandboxed webview, so any logs you make from your app won't show up in the chrome devtools console linked to your apps containing window, however you can open the developer tools for the webview by running the following command from the app container console:

```
$("#sandbox-webview").openDevTools();
```

### Publishing your app

To allow users to install your app, you will need to upload the contents to swarm and then write and sign a manifest file which can be distributed and used for installation.

#### 1. Upload Content to Swarm

To upload your package contents you will need to run a local Swarm node. We recommend using the [Erebos library](https://github.com/MainframeHQ/erebos), once you've followed the setup documented in the Erebos repo you can run your docker image with the following command:

```
docker run --publish 8500:8500 --interactive --tty erebos
```

Once your Swarm node is running you can publish your app contents using:

```
./packages/cli/bin/run app:publishContents --id <APP_ID>
```

If you don't know your app's ID, you can view details of all your apps by running:

```
./packages/cli/bin/run app:list
```

When the upload is complete, you should be presented with a swarm hash, used to identify the location of your contents in the network.

#### 2. Write the App Manifest File

The following command will generate your manifest JSON file and sign it using your app ID and developer ID, allowing users to verify the author and integrity of the file and app contents during the install process.

```
./packages/cli/bin/run app:writeManifest --id <APP_ID>
```

When decoded during install, the file will contain:

- App ID
- Developer identity (automatically created in step 1)
- Version number
- Swarm hash
- Permission requirements

---

## Troubleshooting

There are several places to look when errors arise initially or during development. Here is an overview:

- if the Launcher won't start, look to the terminal logs where you ran `yarn dev`. Some javascript errors could prevent Electron from showing a window.
- if there are problems inside the launcher or apps, you can use the regular Chrome debugger (cmd-option-I) to view logs and diagnose issues.
- the daemon also shows errors in the terminal, and you can enable more verbose logging by setting the `DEBUG="*"` environment variable, e.g. `DEBUG="*" ./bin/run daemon:start`
