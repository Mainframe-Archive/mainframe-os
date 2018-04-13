// @flow

import Identity from '../identity/Identity'
import { fromBase64, toBase64, type base64 } from '../utils'

export type AppManifestSerialized = {
  identity: base64,
  manifest: base64,
}

export default class AppManifest {
  static hydrate = ({ identity, manifest }: AppManifestSerialized) => {
    return new AppManifest(fromBase64(identity), fromBase64(manifest))
  }

  _identity: Identity
  _manifest: Buffer
  _data: ?Object

  constructor(identity: Buffer | Identity, manifest: Buffer) {
    this._identity =
      identity instanceof Identity ? identity : new Identity(identity)
    this._manifest = manifest

    const buffer = this._identity.open(manifest)
    if (buffer != null) {
      try {
        this._data = JSON.parse(buffer.toString('utf8'))
        // TODO: validate schema
      } catch (err) {}
    }
  }

  get valid(): boolean {
    return this._data != null
  }

  serialized(): AppManifestSerialized {
    return {
      identity: toBase64(this._identity.publicKey),
      manifest: toBase64(this._manifest),
    }
  }
}
