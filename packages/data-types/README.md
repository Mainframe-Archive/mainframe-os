# Mainframe data types utilities

## Types

## MainframeID

Ed25519 public key encoded as multibase base64url string in URN.

## Constants

### MAINFRAME_ID_URN_NID

NID used for the manifest IDs URN.

### MAINFRAME_ID_URN_NSS_ENCODING

Encoding for the NSS value.

## API

### mainframeIDType()

**Arguments**

1.  `value: any`

**Returns** `MainframeID`

### isValidMainframeID()

**Arguments**

1.  `value: string`

**Returns** `boolean`

### encodeMainframeID()

**Arguments**

1.  `value: Buffer`

**Returns** `MainframeID`

### decodeMainframeID()

**Arguments**

1.  `value: MainframeID`

**Returns** `Buffer`
