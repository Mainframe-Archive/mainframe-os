---
id: publish
title: Publish Your Dapp
---

### Packaging dapps for Mainframe OS

Mainframe dapps must be packaged as static Web apps with an `index.html` entry file. All assets reference paths must be relative rather than rely on a specific resolution behaviour.
For example to add an application built from [create-mainframe-dapp](create-mainframe-dapp.md) , the `build` folder (created during the build) must be selected rather than the root application folder.

### Testing your dapp in Mainframe OS

Mainframe OS has developer tools where you are able to create, run and manage your apps. To access these tools, go to the **More** Tab and click the **App Development Tool** link.

Once you have created your Developer Identity, click **Add** to import your dapp. You will then be guided through some steps to provide meta data for your app, link to your apps contents folder (the folder containing the `index.html` entry file), and set any required permissions.

Once created, you should see your app displayed in the launcher, clicking **Open** should open it in a new window and load your app contents.

#### Debugging with Chrome Developer Tools

Similar to the Chrome web browser, Mainframe OS provides developer tools ("devtools") to inspect the DOM, and view javascript console output (among other capabilities). However, unlike the web browser, there is not one set of devtools per app, but several sets of devtools. Most likely, you will want the app-specific devtools (see #1 below), but if you are developing the Mainframe OS stack itself, you may benefit from the others as well.

1. The HTML, CSS, and javascript code specific to your app is associated with its own devtools window. When running Mainframe OS in developer mode, this window will open automatically when you open an app. You can also force it to open by running the following command from the app container ("Trusted UI") console:

```
$("#sandbox-webview").openDevTools();
```

2. Each app window has a "Trusted UI" container with associated devtools. Errors, warnings, and logs related to the "Trusted UI" portion of the app container will be visible there. Most people will not need this when developing an app. You can enable this view via the menu, when the app window has the focus: `View` -> `Toggle Developer Tools`.

3. The main Launcher window also has its own developer tools pane. Errors, warnings, and logs associated with the main Launcher thread will be visible there. Most people will not need this when developing an app. You can enable this view via the menu, when the main launcher window has the focus: `View` -> `Toggle Developer Tools`.

### Publishing your app

To allow users to install your app, you will need to upload the contents to Swarm. You'll get an App ID which other users can then use to install the app on their Mainframe OS system. This can be done with the **Publish** button inside Mainframe OS, as described [here](introduction.md), which connects to the p2p Swarm network through `mainframe-gateways.net`.

It is also possible to setup and use a local Swarm node, rather than the gateway.


### Setup local Swarm node

You might prefer to use a local swarm node rather than the Mainframe gateway (configured by default) or Swarm gateways (available through `swarm-gateways.net`).

Changing the Swarm configuration is only possible when using a version of Mainframe OS built from source. There is not access to the CLI tools needed when Mainframe OS is built from the binaries installer.

Installation instructions are available in the [Swarm guide](https://swarm-guide.readthedocs.io/en/latest/installation.html) and a [Docker image](https://github.com/ethersphere/swarm-docker) is also available.

Your vault settings will need to be updated to use the local node rather than the Mainframe or Swarm gateways, running the following command (replace `http://localhost:8500` by the Swarm URL if different):

```
./packages/cli/bin/run vault:settings --bzz-url http://localhost:8500
```


>**Note:** If you don't know your app's ID, you can view details of all your apps by running: `./packages/cli/bin/run app:list`

