---
id: introduction
title: Getting Started with Mainframe OS
sidebar_label: Getting Started
---

Mainframe OS is an integrated development and execution environment that dramatically simplifies the creation and use of unstoppable, privacy-driven, decentralized applications.

### Prerequisites
- [Node](https://nodejs.org/en/) v10.x and npm v6.x

## Install Mainframe OS

#### MacOS
1. From a terminal window run the following command to install the Mainframe OS Daemon

        $ npm install --global @mainframe/daemon
2. **[Download](https://s3.us-east-2.amazonaws.com/mainframe-os-releases/v0.2/MainframeOS.dmg)** Mainframe OS Installer
3. Click. Drag. Run!


#### Windows & Unix

Go to [Mainframe Platform](platform.md) for instructions to compile and run Mainframe OS from source.

### Mainframe OS Setup
Follow onscreen instructions to secure your vault, setup your identity, and create a new software wallet (or import/connect an existing wallet).

### Add a Contact

**Mainframe OS > Contacts > Add Contact**
Paste Contact ID of another Mainframe OS User

Jake: `a5d66aa829306a04594634b451ca03f293a115a8f37c558f660c2db5bb5bdc83`

## Create your Dapp
Use [create-mainframe-dapp](create-mainframe-dapp.md) to setup your dapp for easy integration with Mainframe OS.

### Launch your dapp in Mainframe OS

Next, __launch Mainframe OS__ and follow the onboarding prompts.

Once you are setup, in the **More Tab** click the **App Development Tool** link.

#### Create a developer identity
 * choose a name for the identity that you will use to publish dapps under.
 * select "create."

Once you have created your Developer Identity, click **Add** to

#### Import your dapp

 * use "test" for the name.
 * 0.0.1 for the version.
 * run `yarn build` from the create-mainframe-dapp directory.
 * select the generated `build` folder for the contents path.


#### App Permissions
 * For our purposes here select "required" for Make transactions to Ethereum Blockchain.
 * And add mainframe.com as a required web request host.
 * Select **Next**

Review the app summary, select **Save**.

#### Run your dapp
Click the icon to view/edit dapp details. Then launch the app by clicking **Open**.

You will initially see the pre-built version of your dapp display in the new window.

#### Host locally
 * In a terminal window run `yarn start` if it isn't still running.
 * With the application being hosted at `http://localhost:3000/`, replace the contents path of your active application window with `http://localhost:3000/`.
 * You should now see live version of `create-mainframe-dapp` render within the active application window.

#### Debugging
The Chrome Developer Tools window will automatically open to enable debugging your dapp while it's running inside Mainframe OS.

### Publish your Dapp
From the app details view in Mainframe OS, click **Publish**.

The resulting App ID is what is needed to share and install your dapp.

### Submit your Dapp
*coming soon*

Submit your dapp to be considered for the Mainframe Suggested Apps. MFT required.
