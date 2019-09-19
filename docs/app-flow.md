---
title: Creating and publishing apps
---

## Creating an app

### Using create-mainframe-dapp

If you are familiar React, you can get started using [`create-mainframe-dapp`](create-mainframe-dapp.md) to setup your app for easy integration with Mainframe OS.

### From scratch

Mainframe OS only needs an `index.html` file to be present to open an app, you can get started simply by creating a new folder with an `index.hml` file having basic contents, for example:

1. `mkdir my-app`
1. `echo '<h1>Hello Mainframe OS</h1>' > my-app/index.html`

## Adding your app in Mainframe OS

### Access the developer tools

1. Launch Mainframe OS
1. In the **More** screen, click the **App development tool** link.

### Create a developer identity

If you haven't already created a developer identity, this is a necessary step before adding an app.
The name you choose will be **publicly displayed** and associated to the applications you publish.

### Import your app

1. Click the **ADD** button.
1. Give your app a name.
1. Give your app a version (it must follow the [Semantic Versioning](https://semver.org/) format).
1. Select the folder containing your application contents (`index.html` and possibly others).

> If you are using [`create-mainframe-dapp`](create-mainframe-dapp.md), make sure to run `yarn build` and open the `build` folder.

### Application permissions

If your application needs to make requests to Web domains, you can add them in this step.
Mainframe OS prevents applications from communicating with Web domains that are not explicitly whitelisted.

> These permissions can be edited before publishing your app, so it is not required to add all the domains you want to whitelist during this step.

## Running your app

1. In the developer tools screen, click the app you want to open.
1. Launch the app by clicking the **OPEN** button.
1. Your app will open in a new window, inside the application sandbox.

### Debugging

The Chrome Developer Tools ("devtools") can be opened from the **View** menu > **Toggle Developer Tools**.
When you open these devtools from your application window, it will be the devtools for the Mainframe sandbox, **not** your application itself.
In order to open the devtools for your app, you must run the following command in the console of the sandbox devtools:

```js
$('webview').openDevTools()
```

## Publishing your app

From the app details view in Mainframe OS:

1. Click the **PUBLISH APP** button.
1. Set the Web domains your app needs to communicate with in the app permissions.
1. Verify the app informations are correct in the summary screen.
1. Click the **PUBLISH** button and wait for your app contents and manifest to be uploaded.
1. The resulting App ID can now be shared with other users of Mainframe OS to install your app.

### Updating your app

After your app has been published, on the app details screen:

1. Click the **New Version +** button.
1. Set the new version number and click the **ADD NEW VERSION** button.
1. You should now see an entry for that version in draft form, that can be edited as needed.
1. When ready, click the **PUBLIC UPDATE** button.
1. Set the Web domains your app needs to communicate with in the app permissions.
1. Verify the app informations are correct in the summary screen.
1. Click the **PUBLISH** button and wait for your app contents and manifest to be uploaded.

Users who have already installed the app will be notified there is an update available and guided through installing it.

New users will automatically have access to the latest version.

### Submitting your app

A future release of Mainframe OS will offer developers the ability to submit their app for review and discovery in Mainframe OS.

In the meantime, don't hesitate to reach out to the Mainframe team using one of the [support channels](support.md) so we can help promote your app!
