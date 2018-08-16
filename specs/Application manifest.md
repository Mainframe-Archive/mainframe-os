# Application manifest

The manifest can be present in two forms: the manifest "data", a JS object containing the necessary information (`id`, `author`, etc.), and a manifest "file", a JSON file containing the signed manifest data, along with the signature keys.\
The manifest data should be seen as the internal representation of the manifest, as used by the platform, while the manifest file is an external representation, meant for sharing and verification.

The [`@mainframe/app-manifest` library](https://github.com/MainframeHQ/js-mainframe/tree/master/packages/app-manifest) provides utilities to create and validate manifests, along with the following libraries:

- [`@mainframe/app-permissions`](https://github.com/MainframeHQ/js-mainframe/tree/master/packages/app-permissions) defines and verifies application permissions.
- [`@mainframe/data-types`](https://github.com/MainframeHQ/js-mainframe/tree/master/packages/data-types) defines the `MainframeID` type used for application and developer identities.

## Required fields

- `id`: `MainframeID` (ed25519 public key in URN)
- `author`: object
  - `id`: `MainframeID` (ed25519 public key in URN)
- `version`: [semver v2.0](https://semver.org/spec/v2.0.0.html) string
- `name`: display name (string)
- `contentsURI`: hex-encoded Swarm (BZZ) hash in URN
- `permissions`: `PermissionsRequirements` object as defined in the [`@mainframe/app-permissions` library](https://github.com/MainframeHQ/js-mainframe/tree/master/packages/app-permissions)

## Optional fields

No optional fields are defined yet.
