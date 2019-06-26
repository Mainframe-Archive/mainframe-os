---
id: windows
title: Windows Instructions
sidebar_label: Windows Instructions
---

#### Dependencies

```
npm install --global --production windows-build-tools
```

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
"packages/cli/bin/run.cmd" env:create
```

This first environment should be created with the `development` type and set as default environment.

>Note: git for windows does not allow selection of options with arrows. so use git within a windows command line (windows+r cmd, bash) because windows cmd does have the ability to select arrow options.

The newly created environment then needs to be configured using the CLI:

```
"packages/cli/bin/run.cmd" daemon:setup --bin-path="packages/daemon/bin/run.cmd"
```

## Development

### Building the code

Whenever code changes in any other package than the launcher, you should build everything (via `lerna`) with:

```
npm run build
```

Now, in one terminal tab, run the daemon:

```
"packages/cli/bin/run.cmd" daemon:start
```

Then, in another tab, run the launcher:

```
cd packages/launcher && npm run dev
```

