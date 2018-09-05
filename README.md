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
import sdk from '@mainframe/sdk'
const sdk = new MainframeSDK()
const res = await sdk.apiVersion()
```

### Publishing your App

**_Developer mode coming soon_!**
We're working towards building a "developer mode" in the launcher that will simplify testing and management of pre released apps, however until then developers are required to go through the full app publishing steps below before you can test your app in the launcher.

#### 1. Register your app in the Daemon

The first step is to create an instance of your app in the deamon, the CLI will ask you to provide some basic metadata and return an app ID.

```
./packages/cli/bin/run app:create
```

#### 2. Set Required Permissions

Developers need to define the apps required permissions using the command below, these preferences will be written to the app's manifest file when it's created and be presented to the user during the install flow. For more information around what API's require permission, please check out the [Permissions docs](packages/app-permissions).

```
./packages/cli/bin/run app:setPermissions --id <APP_ID>
```

#### 3. Upload Content to Swarm

To upload your package contents you will need to run a local Swarm node. We recommend using the [Erebos library](https://github.com/MainframeHQ/erebos), once you've followed the setup documented in the Erebos repo you can run your docker image with the following command:

```
docker run --publish 8500:8500 --interactive --tty erebos
```

Once your Swarm node is running you can publish your app contents using:

```
./packages/cli/bin/run app:publishContents --id <APP_ID>
```

When the upload is complete, you should be presented with a swarm hash, used to identify the location of your contents in the network.

#### 4. Write the App Manifest File

The final step is to produce and sign your apps manifest.json file, used for distributing and installing your app. The following command will generate the JSON file and sign it using your app ID and developer ID, allowing users to verify the author and integrity of the file and app contents during the install process.

```
./packages/cli/bin/run app:writeManifest --id <APP_ID>
```

When decoded during install, the file will contain:

- App ID
- Developer identity (automatically created in step 1)
- Version number
- Swarm hash
- Permission requirements

### Testing Your App

Once you have created an App manifest file, use the app install flow in the launcher to download and install the app.

**Testing Changes**

Until we add more developer functionality in the launcher, to test changes in your app, update the apps contents folder with the updated files, located in:
`<User root>/Library/Application Support/mainframe-env-<env_name>-nodejs/apps`

---

## Troubleshooting

There are several places to look when errors arise initially or during development. Here is an overview:

- if the Launcher won't start, look to the terminal logs where you ran `yarn dev`. Some javascript errors could prevent Electron from showing a window.
- if there are problems inside the launcher or apps, you can use the regular Chrome debugger (cmd-option-I) to view logs and diagnose issues.
- the daemon also shows errors in the terminal, and you can enable more verbose logging by setting the `DEBUG="*"` environment variable, e.g. `DEBUG="*" ./bin/run daemon:start`
