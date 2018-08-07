# Application manifest utilities

## Types

### ManifestData

Shape of the expected manifest data object.

### ManifestValidationResult

Either `true` if the validation succeeds or `Array<Object>` of validation errors returned by [`fastest-validator`](https://github.com/icebob/fastest-validator).

## Constants

### INVALID_ID_ERROR

Error message for invalid Mainframe ID value using `fastest-validator`.

### INVALID_SEMVER_ERROR

Error message for invalid SemVer value using `fastest-validator`.

### INVALID_URN_ERROR

Error message for invalid URN value using `fastest-validator`.

### MANIFEST_SCHEMA_MESSAGES

Object of the previous error messages for `fastest-validator` configuration.

### ID_SCHEMA

`fastest-validator` schema for a manifest identifier (Mainframe ID).

### SEMVER_SCHEMA

`fastest-validator` schema for a SemVer value.

### URN_SCHEMA

`fastest-validator` schema for an URN value.

### NAME_SCHEMA

`fastest-validator` schema for an application name as validated by the manifest (3 to 50 characters).

### MANIFEST_SCHEMA

`fastest-validator` schema for a full manifest.

## API

### isValidSemver()

**Arguments**

1.  `value: string`

**Returns** `boolean`

### isValidURN()

**Arguments**

1.  `value: string`

**Returns** `boolean`

### new ManifestError()

**Arguments**

1.  `message: string`: error message
1.  `errors?: Array<Object>`: validation errors

### validateManifest()

**Arguments**

1.  `manifest: ManifestData`

**Returns** `ManifestValidationResult`

### parseManifestData()

Parses and validates the provided buffer as manifest data. Throws a `ManifestError` if parsing or validation fails.

**Arguments**

1.  `buffer: ?Buffer`

**Returns** `ManifestData`

### verifyManifest()

Verifies the provided [`SignedContents`](https://github.com/MainframeHQ/js-tools/tree/master/packages/secure-file#signedcontents) match a signed manifest and returns its data. Throws a `ManifestError` if signature verification, parsing or validation fails.

**Arguments**

1.  `contents: SignedContents`
1.  `keys?: Array<Buffer>`: optional list of public keys to use to verify the signatures rather than the ones provided in the `contents`.

**Returns** `ManifestData`

### readManifestFile()

Verifies the provided file path matches a signed manifest and returns its data. Throws a `ManifestError` if signature verification, parsing or validation fails.

**Arguments**

1.  `path: string`
1.  `keys?: Array<Buffer>`: optional list of public keys to use to verify the signatures rather than the ones provided in the file.

**Returns** `Promise<{ data: ManifestData, file: SecureFile<SignedContents> }>`, see the relevant docs for the [`SecureFile`](https://github.com/MainframeHQ/js-tools/tree/master/packages/secure-file#securefile) and [`SignedContents`](https://github.com/MainframeHQ/js-tools/tree/master/packages/secure-file#signedcontents) types.

### writeManifestFile()

Verifies the provided `data` is a valid manifest and writes the `SecureFile<SignedContents>` contents to the provided `path`. Throws a `ManifestError` if validation fails.

**Arguments**

1.  `path: string`
1.  `data: ManifestData`
1.  `keys: Array<KeyPair>`: list of [`KeyPair` objects](https://github.com/MainframeHQ/js-tools/tree/master/packages/utils-crypto#keypair) to sign the manifest with.

**Returns** `Promise<void>`
