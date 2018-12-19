# Mainframe CLI

## Usage

```sh
# In packages/cli
./bin/run
```

## Commands

- `env:create`: create a new environment
- `env:default`: get or set the default environment to use
- `env:delete`: delete an environment
- `env:list`: list the environments
- `daemon:setup`: configure the daemon binary and socket paths
- `daemon:status`: display the daemon running status and socket path
- `daemon:start`: start the daemon using the store configuration
- `daemon:stop`: start the daemon using the store configuration
- `client:repl`: open a node REPL with an injected `client` object connected to the daemon
- `client:setup`: ensure the environment has a default vault setup
- `vault:create`: create a vault
- `vault:delete`: delete a vault
- `vault:list`: list existing vaults
- `vault:settings`: set and/or display a vault settings
- `graphql:query`: execute a GraphQL query
- `graphql:schema`: write the GraphQL schema
- `graphql:server`: create a HTTP proxy for GraphQL queries
- `identity:create`: create an identity
- `identity:list`: list identities
- `app:create`: create an app
- `app:publishContents`: publish the app contents to Swarm
- `app:writeManifest`: writes the app manifest

## Environment setup

1.  Run `env:create` to create a new environment, set it as default unless you want to provide it explicitly in the next commands
1.  Run `daemon:setup` to configure the path to the `daemon` CLI, ex `./bin/run daemon:setup --bin-path=../daemon/bin/run`
1.  Run `daemon:start` to start the daemon, use `DEBUG="mainframe:*" ./bin/run daemon:start` to see the logs
1.  Run `client:setup` to create a new vault and configure it to be used by default
1.  Run `client:repl` to start interacting with the daemon
