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

## Development

### Building the code

Whenever code changes in any other package than the launcher, you should build everything (via `lerna`) with:

```
npm run build
```
