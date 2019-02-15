---
id: publish
title: Publish Your Dapp
---

### Packaging dapps for Mainframe OS

Mainframe dapps must be packaged as static Web apps with an `index.html` entry file. All assets reference paths must be relative rather than rely on a specific resolution behaviour.
For example to add the [Onyx Stats](applications/onyx-stats) contents to the Launcher, the `dist` folder (created during the build) must be selected rather than the root application folder.

### Testing your dapp in Mainframe OS

Mainframe OS has a developer mode where you are be able to create, run and manage your apps. To access this dev mode, go to the **More** Tab and click the **App Development Tool** link.

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

To allow users to install your app, you will need to upload the contents to swarm and then write and sign a manifest file which can be distributed and used for installation.

This can be done with the **Publish** button inside Mainframe OS, as described [here](quick-start.md), if you installed Mainframe OS through the downloaded binaries.
If you built Mainframe OS from source, the swarm-gateways upload limitation mentioned below will apply. Below are alternate steps to publish manually instead.

#### Upload Content to Swarm

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

When the upload is complete, you should be presented with a swarm hash, used to identify the location of your contents in the network. **This is the address needed for others to install your dapp.**
