---
sidebar_label: Application development
title: Developing Mainframe applications
---

Mainframe applications are Web applications running in a sandboxed environment.
This sandboxed environment restricts some application capabilities compared to regular Web browsers in order to provide more privacy and security to Mainframe OS users, notably based on the permissions they grant.

## Application flow

Mainframe apps can be built using any Web technology supported by Electron v6 (Chromium v76), but need to contain at least an `index.html` file that Mainframe OS will open to run the application once installed.
Apps contents (HTML, JavaScript and other assets) are stored using the Swarm when an app gets published, along with a manifest file containing metadata about the app.

Once published, an app gets a unique Mainframe App ID that can be used by any user of Mainframe OS to install it.
New versions can also be published by developers, Mainframe OS notifying users having the app installed that it can be updated.

> More details are available in the [application creation and publication documentation](app-flow.md).

## Mainframe APIs

In order to access the possibilities offered by Mainframe OS, an app can communicate with the underlying platform using the injected `window.mainframe.rpc` API. The easiest way to interact with the platform is to use the [Mainframe SDK](sdk.md).

> The [SDK documentation](sdk.md) also presents the different APIs made available to apps by Mainframe OS.

## Getting help

Get in touch with the Mainframe team using one of the [support channels available](support.md) if you have any question about developing Mainframe apps.
