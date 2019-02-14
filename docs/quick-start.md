---
id: quick-start
title: Quick Start
---
> This guide assumes some familiarity with React development.
### Prerequisites
 - [Yarn](https://yarnpkg.com/lang/en/docs/install/) v1.13.x 

### Install Mainframe OS
Download [Mainframe OS](https://mainframe.com/developers/) and install it on your local machine.
Alternatively, jump to the respective [Unix Instructions](unix.md) or [Windows Instructions](windows.md) to compile it from source.

#### Fork create-mainframe-dapp
* [Fork the create-mainframe-dapp](https://github.com/MainframeHQ/create-mainframe-dapp/fork) repo.
* `git clone https://github.com/<YOUR_USERNAME>/create-mainframe-dapp.git` 
* `cd create-mainframe-dapp`
* `yarn`
* `yarn start`

This project contains a react based example dApp. It is configured for development within our electron environment and integrated with the Mainframe SDK out of the box. 

<script id="asciicast-hhORMkpwEHMnliU8kUHfa00C4" src="https://asciinema.org/a/hhORMkpwEHMnliU8kUHfa00C4.js" data-size="medium" data-speed="2" async></script>

### Launch within Mainframe OS

Next, __launch Mainframe OS__ and follow the onboarding prompts.

Once you are setup, with the "Application" window active, select __"Create New"__

In the prompts:
 * use "test" for the name.
 * 0.0.1 for the version.
 * run `yarn build` from the create-mainframe-dapp directory.
 * select the generated `build` folder for the contents path.


Create a developer identity:
 * choose a name for the identity that you will use to publish dapps under.
 * select "create."
  
App Permissions: 
 * For our purposes here select "required" for Make transactions to Ethereum Blockchain.
 * And add mainframe.com as a required web request host.
 * Select "save."
 
Review the app summary, select "create application." Then, launch the app by double clicking it from the "Applications" window.

Host locally:
 * In a terminal window run `yarn start` if it isn't still running.
 * With the application being hosted at `http://localhost:3000/`, replace the contents path of your active application window with `http://localhost:3000/`.
 * You should now see the `create-mainframe-dapp` render within the active application window.
