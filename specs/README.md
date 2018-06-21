# Mainframe platform specifications

## Client-daemon communication

### Protocol

The daemon and server communicate over [JSON-RPC version 2.0](http://www.jsonrpc.org/specification).\
At the moment neither the client nor the daemon support batch requests.

### Errors

Beyond the [JSON-RPC protocol errors](http://www.jsonrpc.org/specification#error_object), the Mainframe platform uses the following error codes:

- `1xxx` for daemon errors (unexpected behaviors / bugs).
- `2xxx` for vault errors (failures to create or open a vault).
- `3xxx` for client errors (missing or invalid request parameters).
- `4xxx` for session errors (invalid state or permissions errors).

The [`@mainframe/rpc-error` library](https://github.com/MainframeHQ/js-tools/tree/master/packages/rpc-error) provides helper functions and is used by both the client and daemon.

### Methods

TODO

## Sandboxed applications

Mainframe applications are composed of two elements: a manifest and a contents package.\
The manifest contains metadata necessary to identify and install an app, such as its `id`, `author` information, `version`, `permissions` and `contentsHash`.\
The `contentsHash` present in the manifest can be used to retrieve the contents package from Swarm if the user decides to install or update the app.
The contents package contains all the assets (HTML, CSS, JS, images, fonts...) necessary to run the app in the Mainframe sandbox.

### Manifest definition

The manifest can be present in two forms: the manifest "data", a JS object containing the necessary information (`id`, `author`, etc.), and a manifest "file", a JSON file containing the signed manifest data, along with the signature keys.\
The manifest data should be seen as the internal representation of the manifest, as used by the platform, while the manifest file is an external representation, meant for sharing and verification.

The [`@mainframe/app-manifest` library](https://github.com/MainframeHQ/js-mainframe/tree/master/packages/app-manifest) provides utilities to create and validate manifests.

#### Required fields

- `id`: base64-encoded signature public key
- `author`: object
  - `id`: base64-encoded signature public key
- `version`: [semver v2.0](https://semver.org/spec/v2.0.0.html) string
- `name`: display name (string)
- `contentsHash`: hex-encoded Swarm (BZZ) hash
- `permissions`: object
  - `required`: object matching the permissions requirement definition
  - `optional`: object matching the permissions requirement definition

#### Optional fields

TODO: additional data useful for discovery such as description, tags, website...

### Permissions definition

TODO
