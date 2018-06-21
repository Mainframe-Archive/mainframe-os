# Application manifest utilities

## Types

### ManifestData

Shape of the expected manifest data object.

### ManifestValidationError

Enum of possible validation errors.

### ManifestValidationResult

Union of `ManifestValidationError` and `valid` string.

## API

### new ManifestError()

**Arguments**

1.  `reason: ManifestValidationError`
1.  `message?: string`: defaults to generic message with the `reason`

### validateManifest()

**Arguments**

1.  `manifest: ManifestData`
1.  `gtVersion?: string`: optional semver value the `manifest.version` must be greater than

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
