# Client-daemon communication

## Protocol

The daemon and server communicate over [JSON-RPC version 2.0](http://www.jsonrpc.org/specification).\
At the moment neither the client nor the daemon support batch requests.

## Errors

Beyond the [JSON-RPC protocol errors](http://www.jsonrpc.org/specification#error_object), the Mainframe platform uses the following error codes:

- `1xxx` for daemon errors (unexpected behaviors / bugs).
- `2xxx` for vault errors (failures to create or open a vault).
- `3xxx` for client errors (missing or invalid request parameters).
- `4xxx` for session errors (invalid state or permissions errors).

The [`@mainframe/rpc-error` library](https://github.com/MainframeHQ/js-tools/tree/master/packages/rpc-error) provides helper functions and is used by both the client and daemon.

## APIs

The APIs are updated frequently as features are being built. For an up-to-date version, check out the [`@mainframe/client` library implementation](https://github.com/MainframeHQ/js-tools/tree/master/packages/client).
