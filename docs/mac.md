---
id: mac
title: Mac & Linux Instructions
sidebar_label: Mac & Unix Instructions
---



[Linux Dependencies](unix.md)


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

This first environment should be created with the `development` type and set as default environment.
The newly created environment then needs to be configured using the CLI:

```
packages/cli/bin/run daemon:setup --bin-path=./packages/daemon/bin/run
```

## Development

### Building the code

Whenever code changes in any other package than the launcher, you should build everything (via `lerna`) with:

```
npm run build
```

Now, in one terminal tab, run the daemon:

```
./packages/cli/bin/run daemon:start
```

Then, in another tab, run the launcher:

```
cd packages/launcher && npm run dev
```

