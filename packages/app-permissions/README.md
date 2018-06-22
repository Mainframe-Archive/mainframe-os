# Application permissions utilities

## Types

### PermissionKeyBasic

Enum of permissions keys that only require a boolean check.

### PermissionKey

Union of `PermissionKeyBasic` and `HTTPS_REQUEST` string.

### HTTPSRequestDefinition

`Array<string>` representing a list of domains.

### PermissionsDefinitions

Permissions definitions as supported by the daemon.

```js
type PermissionsDefinitions = {
  HTTPS_REQUEST: HTTPSRequestDefinition,
  [PermissionKeyBasic]: boolean,
}
```

### PartialPermissionsDefinitions

Permissions definitions as defined in an application manifest.

```js
type PartialPermissionsDefinitions = {
  HTTPS_REQUEST?: HTTPSRequestDefinition,
  [PermissionKeyBasic]: boolean,
}
```

### PermissionsDefinitionsDifference

Differences between two `PartialPermissionsDefinitions`.

```js
type PermissionsDefinitionsDifference = {
  added: PartialPermissionsDefinitions,
  changed: PartialPermissionsDefinitions,
  removed: PartialPermissionsDefinitions,
  unchanged: PartialPermissionsDefinitions,
}
```

### HTTPSRequestGrant

Permissions granted by the user for the `HTTPS_REQUEST` key.

```js
type HTTPSRequestGrant = {
  granted: HTTPSRequestDefinition,
  denied: HTTPSRequestDefinition,
}
```

### PermissionsGrants

Permissions granted by the user.

```js
type PermissionsGrants = {
  HTTPS_REQUEST: HTTPSRequestGrant,
  [PermissionKeyBasic]: boolean,
}
```

### PermissionGrant

`type PermissionGrant = $Values<PermissionsGrants>`

### PermissionRequirement

Enum for permission requirement as defined in an application manifest: `'required' | 'optional'`.

### PermissionLifetime

Lifetime of a permission grant for a running app.

```js
type PermissionLifetime =
  | 'app' // As long as the app is installed
  | 'user' // As long as the user allows
  | 'session' // As long as the app is running
```

### PermissionsRequirements

Permissions requirements as defined in an application manifest.

```js
type PermissionsRequirements = {
  [PermissionRequirement]: PermissionsDefinitions,
}
```

### PermissionsRequirementsDifference

```js
type PermissionsRequirementsDifference = {
  [PermissionRequirement]: PermissionsDefinitionsDifference,
}
```

### PermissionsDetails

```js
type PermissionsDetails = { [PermissionLifetime]: PermissionsGrants }
```

### PermissionCheckResult

```js
type PermissionCheckResult =
  | 'unknown_key' // Not a valid permission key
  | 'not_set' // Valid key but no value
  | 'invalid_input' // Special for HTTPS_REQUEST: domain not provided
  | 'granted'
  | 'denied'
```

## APIs

### EMPTY_DEFINITIONS

**Constant** of type `PermissionsDefinitions`

### createHTTPSRequestGrant()

**Arguments**

1.  `granted?: HTTPSRequestDefinition`, defaults to `[]`
1.  `denied?: HTTPSRequestDefinition`, defaults to `[]`

**Returns** `HTTPSRequestGrant`

### mergeGrantsToDetails()

**Arguments**

1.  `app: PermissionsGrants`
1.  `user: PermissionsGrants`

**Returns** `PermissionsDetails`

### checkPermission()

**Arguments**

1.  `permissions: PermissionsGrants`
1.  `key: PermissionKey`
1.  `input?: ?string`: value to check against, only needed with the `HTTPS_REQUEST` key.

**Returns** `HTTPSRequestGrant`

### getDefinitionsDifference()

**Arguments**

1.  `current?: PermissionsDefinitions`, defaults to `EMPTY_DEFINITIONS`
1.  `next?: PermissionsDefinitions`, defaults to `EMPTY_DEFINITIONS`

**Returns** `PermissionsDefinitionsDifference`

### getRequirementsDifference()

**Arguments**

1.  `current?: PermissionsRequirements`, defaults to `{}`
1.  `next?: PermissionsRequirements`, defaults to `{}`

**Returns** `PermissionsRequirementsDifference`
