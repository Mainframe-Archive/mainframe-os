---
id: introduction
title: Getting Started with Mainframe OS
sidebar_label: Getting Started
---

Mainframe OS is an integrated development and execution environment that dramatically simplifies the creation and use of unstoppable, privacy-driven, decentralized applications.

### Prerequisites
- [Node](https://nodejs.org/en/) v10.x and npm v6.x

## Install Mainframe OS

> Note: We are currently in final stages working toward a release of a new version of Mainframe OS, expected April 15, 2019. A new macOS binary installer will be available then.

Go to [Mainframe Platform](platform.md) for instructions to compile and run Mainframe OS from source.

### Mainframe OS Setup
Follow onscreen instructions to secure your vault, setup your identity, and create a new software wallet (or import/connect an existing wallet).

### Add a Contact

**Mainframe OS > Contacts > Add Contact**

Paste Mainframe ID of another Mainframe OS user. The Mainframe ID can be found on the **Identity** tab of Mainframe OS, or in contacts under your own entry.
There are two options for adding a contact:
1. **Mutual Invitation:** Exchange Mainframe IDs out-of-band with other Mainframe OS users and each of you add each other's Mainframe ID. Once you have each added each other, it should no longer appear as "pending". This option is FREE.
2. **Blockchain Invitation:** One user can add another user and using a blockchain transaction can send an invitation and notification to the other user. Once the second user sees and accepts the invitation, the contacts are no longer "pending".
This option requires the invitor to stake 100MFT (plus applicable gas fees). Once the invitee accepts the invitation, the invitor can re-claim their stake. If the invitee alternatively rejects the invitation,
they can keep the stake themselves. This system incentivizes responsible "cold-calling" and penalizes spamming.



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

 * give your dapp a name
 * give your dapp a version (standard semver format, for example 0.1.0)
 * run `yarn build` from the create-mainframe-dapp directory
 * select the generated `build` folder for the contents path


#### App Permissions
 * For our purposes here select "required" for Make transactions to Ethereum Blockchain.
 * And add mainframe.com as a required web request host.
 * Select **Next**

Review the app summary, select **Save**.

#### Run your dapp
Click the icon to view/edit dapp details. Then launch the app by clicking **Open**.

You will initially see the pre-built version of your dapp display in the new window.

***Note:** there is a known issue on Windows and Unix systems where the app window for a built or installed app opens, but is blank/only white. See steps below to host locally for a workaround. For end-users, only Mac OS is supported.*

#### Host locally
 * In a terminal window run `yarn start` if it isn't still running.
 * With the application being hosted at `http://localhost:3000/`, replace the contents path of your active application window with `http://localhost:3000/`.
 * You should now see live version of `create-mainframe-dapp` render within the active application window.

#### Debugging
The Chrome Developer Tools window will automatically open to enable debugging your dapp while it's running inside Mainframe OS.

### Publish your Dapp
From the app details view in Mainframe OS, click **Publish**.

The resulting App ID is what is needed to share and install your dapp.

### Update your Dapp
Once the app has been published, on the app details screen choose **New Version +**.

Bump the version number and Add. You should now see an entry for that version in draft form. You can work on the changes and when ready choose **Publish Update**.

Users who have already installed the app will be notified there is an available update and guided through installing it.

New users will automatically have access to the latest version.


### Submit your Dapp
*coming soon*

Submit your dapp to be considered for the Mainframe Suggested Apps. MFT staking required.
