# Mainframe config

Shared local configuration for Mainframe packages.

## Installation

```sh
yarn add @mainframe/config
```

## Usage

The `Environment` class provides a namespaced persisted configuration and paths to be used.

All other functions need to be provided with an `Environment` instance they use to interact.

```js
import { Environment, getDaemonSocketPath } from '@mainframe/config'

const env = new Environment('development')
const socketPath = getDaemonSocketPath(env)
```

## API

### new Environment()

**Arguments**

1.  `name: string`: name of the environment

### Environment instance

#### .name

**Returns** `string` the environment name

#### .config

**Returns** [`Conf` instance](https://github.com/sindresorhus/conf#api)

#### .paths

**Returns** [env paths](https://github.com/sindresorhus/env-paths#api) shared by the platform

### getDaemonBinPath()

**Arguments**

1.  `env: Environment`

**Returns** `string` the path to the daemon binary

### setDaemonBinPath()

**Arguments**

1.  `env: Environment`
1.  `path: string`: the path to the daemon binary

### getDaemonSocketPath()

**Arguments**

1.  `env: Environment`

**Returns** `string` the socket path

### setDaemonSocketPath()

**Arguments**

1.  `env: Environment`
1.  `path: string`: the socket path

## License

MIT
