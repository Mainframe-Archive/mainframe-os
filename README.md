# Mainframe Platform

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

In order to make it easier to share code among packages, this project uses [lerna](https://lernajs.io/). Whenever code changes, it's expected that you run `npm run build` from the root of the project directory, and it will kick off the necessary `lerna` build processes in the package folders.

## Project Status

This project is in alpha, lots of breaking changes are to be expected between releases. It is using libraries and services that are themselves still in early stages of development. The cryptography and overall security have not been audited, no guarantees should be expected from this project at this stage.

## Getting Started

### Contributing
 > see [contributing.md](contributing.md)
### Prerequisites

- [Node](https://nodejs.org/en/) v10+ (includes npm)
- Installed git and added to PATH environment variable
- #### Linux
  `sudo apt install -y libudev-dev libtool libusb-1.0-0-dev build-essential`

- #### Windows
  ``npm install --global --production windows-build-tools``

### Setup

Each package contains (or will contain) a readme with further information pertaining to setup. A shortcut guide is as follows:

In the root of the project, install node dependencies:

```
npm install
npm run bootstrap
npm run build
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
The newly created environment then needs to be configured using the CLI:

```
packages/cli/bin/run daemon:setup --bin-path=./packages/daemon/bin/run
```
Or on Windows
```
"packages/cli/bin/run.cmd" daemon:setup --bin-path="packages/daemon/bin/run.cmd"
```

## Development

Whenever code changes in more than one package, you should build everything (via `lerna`) with:

```
npm run build
```

Now, in one terminal tab, run the daemon:

```
./packages/cli/bin/run daemon:start
```
Or on Windows
```
"packages/cli/bin/run.cmd" daemon:start
```

Then, in another tab, run the launcher:

```
cd packages/launcher && npm run dev
```

### Building Mainframe Apps

You can build a Mainframe app using any Web technology supported by Electron v2 (Chromium v61).

The Mainframe teams build apps using [React Native Web](https://github.com/necolas/react-native-web), you can see a sample setup in the reference app, [Onyx Stats](/applications/onyx-stats). We are currently working on a UI Kit to make it easier for developers to build Mainframe app interfaces and will also be releasing a bootstrapping script to streamline the initial setup process.

Your app will need to use the [Mainframe SDK](packages/sdk) to interact with the daemon, you can view the available API's in the [SDK package](packages/sdk/README.md).

Example SDK usage:

```
import MainframeSDK from '@mainframe/sdk'
const sdk = new MainframeSDK()
const res = await sdk.apiVersion()
```

### Packaging Mainframe Apps for the Launcher

Mainframe Apps must be packaged as static Web apps with an `index.html` entry file. All assets reference paths must be relative rather than rely on a specific resolution behaviour.
For example to add the [Onyx Stats](applications/onyx-stats) contents to the Launcher, the `dist` folder (created during the build) must be selected rather than the root application folder.

### Testing your App from the Launcher

The Launcher has a developer mode where you are be able to create, run and manage your apps. To access this dev mode you can use the toggle in the bottom left corner of the Launcher.

In developer mode, click the `Create new App` button to begin the app creation flow. You will then be guided through some steps to provide meta data for your app, link to your apps contents folder (the folder containing the `index.html` entry file), create or select your developer identity and set any required permissions.

Once created, you should see your app displayed in the launcher, clicking it should open it in a new window and load your app contents.

**_Editing your app details from the launcher is currently not supported, if you'd like to amend your app metadata or permissions once it's been created, you can use the CLI or simply delete and recreate your app._**

#### Debugging with Chrome Developer Tools

Similar to the Chrome web browser, the Launcher provides developer tools ("devtools") to inspect the DOM, and view javascript console output (among other capabilities). However, unlike the web browser, there is not one set of devtools per app, but several sets of devtools. Most likely, you will want the app-specific devtools (see #1 below), but if you are developing the MainframeOS stack itself, you may benefit from the others as well.

1. The HTML, CSS, and javascript code specific to your app is associated with its own devtools window. When running MainframeOS in developer mode, this window will open automatically when you open an app. You can also force it to open by running the following command from the app container ("Trusted UI") console:

```
$("#sandbox-webview").openDevTools();
```

2. Each app window has a "Trusted UI" container with associated devtools. Errors, warnings, and logs related to the "Trusted UI" portion of the app container will be visible there. Most people will not need this when developing an app. You can enable this view via the menu, when the app window has the focus: `View` -> `Toggle Developer Tools`.

3. The main Launcher window also has its own developer tools pane. Errors, warnings, and logs associated with the main Launcher thread will be visible there. Most people will not need this when developing an app. You can enable this view via the menu, when the main launcher window has the focus: `View` -> `Toggle Developer Tools`.

### Publishing your app

To allow users to install your app, you will need to upload the contents to swarm and then write and sign a manifest file which can be distributed and used for installation.

#### 1. Upload Content to Swarm

By default, a vault is configured to connect to the [Swarm gateways](https://swarm-gateways.net/) to interact with Swarm. This works well for downloads and other requests, however uploads are limited to 1 MB, which might prevent from being able to upload some apps.
In order to upload apps contents larger than 1 MB, a local Swarm node must be used. Installation instructions are available in the [Swarm guide](https://swarm-guide.readthedocs.io/en/latest/installation.html) and a [Docker image](https://github.com/ethersphere/swarm-docker) is also available.

Your vault settings will need to be updated to use the local node rather than the Swarm gateways, running the following command (replace `http://localhost:8500` by the Swarm URL if different):

```
./packages/cli/bin/run vault:settings --bzz-url http://localhost:8500
```

Once your Swarm node is running and you vault settings updated you can publish your app contents using:

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

- if the Launcher won't start, look to the terminal logs where you ran `npm run dev`. Some javascript errors could prevent Electron from showing a window.
- you can send all logs (including in-app `console.log` calls) to the terminal by starting electron with the `ELECTRON_ENABLE_LOGGING` environment variable, e.g. `ELECTRON_ENABLE_LOGGING=1 npm run dev`
- if there are problems inside the launcher or apps, you can use the regular Chrome debugger (cmd-option-I) to view logs and diagnose issues.
- the daemon also shows errors in the terminal, and you can enable more verbose logging by setting the `DEBUG="*"` environment variable, e.g. `DEBUG="*" ./packages/cli/bin/run daemon:start`
