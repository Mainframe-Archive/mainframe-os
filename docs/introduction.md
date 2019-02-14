---
id: introduction
title: Mainframe Platform
sidebar_label: Introduction
---

A platform for easily building and running distributed, unstoppable apps.

## Overview

The main components (packages) of the Mainframe Platform are as follows:

- `daemon`: a background daemon process that communicates with decentralized services
- `launcher`: the Mainframe application installing, launching and running sandboxed apps

In addition, there are several auxiliary packages:

- `app-manifest`: a utility library for app manifests creation an validation
- `app-permissions`: a utility library for distributed app permissions
- `cli`: a command-line interface to communicate with the daemon
- `client`: a library used by the CLI & launcher to communicate with the daemon
- `config`: shared configuration utilities used by several packages
- `data-types`: shared data primitives
- `toolbox`: a set of functions that both the launcher and the cli use

In order to make it easier to share code among packages, this project uses [lerna](https://lernajs.io/). Whenever code changes, it's expected that you run `npm run build` from the root of the project directory, and it will kick off the necessary `lerna` build processes in the package folders.

## Project Status

This project is in alpha, lots of breaking changes are to be expected between releases. It is using libraries and services that are themselves still in early stages of development. The cryptography and overall security have not been audited, no guarantees should be expected from this project at this stage.
